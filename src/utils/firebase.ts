import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, signInWithCredential } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  getDocFromServer,
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize core Firebase services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { onAuthStateChanged };

// Process Google Authentication redirect results on page load (essential for mobile browsers)
getRedirectResult(auth).then(async (result) => {
  if (result?.user) {
    const user = result.user;
    await saveUserData(user.uid, {
      fullName: user.displayName || 'Google Yurttaşı',
      email: user.email || ''
    }).catch(err => console.error("Error saving redirect user data:", err));
  }
}).catch(err => {
  console.error("Firebase redirect resolution error:", err);
});

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Check Firestore connection status
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: the client is offline.");
    }
  }
}

// User-Related Cloud Store functions
export async function saveUserData(userId: string, data: { fullName: string; email: string }) {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, 'users', userId), {
      uid: userId,
      fullName: data.fullName,
      email: data.email,
      createdAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Cloud Saves Store functions
export async function saveGameToCloud(userId: string, saveName: string, saveId: string, dataJson: string) {
  const path = `users/${userId}/saves/${saveId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'saves', saveId), {
      userId,
      saveName,
      dataJson,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function loadGamesFromCloud(userId: string) {
  const path = `users/${userId}/saves`;
  try {
    const qSnapshot = await getDocs(collection(db, 'users', userId, 'saves'));
    return qSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function deleteGameFromCloud(userId: string, saveId: string) {
  const path = `users/${userId}/saves/${saveId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'saves', saveId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Global Arena (Multiplayer Campaigns / Live Arena Ticker)
export async function shareCampaignToArena(
  campaignId: string, 
  data: {
    userId: string;
    playerName: string;
    partyName: string;
    shortName: string;
    ideology: string;
    difficulty: string;
    support: number;
    weeksRemaining: number;
    votersSupport?: number;
    coalitionInfo?: string;
    finished: boolean;
  }
) {
  const path = `globalArena/${campaignId}`;
  try {
    await setDoc(doc(db, 'globalArena', campaignId), {
      ...data,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchGlobalArenaCampaigns() {
  const path = 'globalArena';
  try {
    const q = query(collection(db, 'globalArena'), orderBy('createdAt', 'desc'), limit(15));
    const qSnapshot = await getDocs(q);
    return qSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
  } catch (err) {
    // If we get an error (e.g. index build or rule denial), log but return empty gracefully to user
    console.error("fetchGlobalArenaCampaigns error: ", err);
    return [];
  }
}

// Guest / Nickname-based authentication helper (works flawlessly in all iframes and mobile browsers)
export async function loginAsGuest(displayName: string) {
  let guestId = localStorage.getItem('guest_uid');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('guest_uid', guestId);
  }
  
  const guestUser = {
    uid: guestId,
    displayName: displayName,
    email: `${displayName.replace(/\s+/g, '').toLowerCase()}@secim.sim`,
    photoURL: null,
    isAnonymous: true
  };
  
  localStorage.setItem('guest_user', JSON.stringify(guestUser));
  
  // Register guest in the Firestore users collection so they possess a valid Firestore user document
  await saveUserData(guestId, {
    fullName: displayName,
    email: guestUser.email
  }).catch(err => console.error("Error registering guest user in Firestore:", err));
  
  return guestUser;
}

// Resilient Google login helper (Supports popup and automatic redirect fallback for tablets, phones, and strict browser sandboxes)
export async function loginWithGoogle() {
  try {
    // 1. Check if the server has GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET configured
    const configRes = await fetch("/api/auth/google/config").catch(() => null);
    const config = configRes ? await configRes.json().catch(() => null) : null;

    if (config && config.configured) {
      console.log("[Firebase Auth] Custom Google Cloud OAuth is active and configured. Directing to secure popup flow.");
      
      const urlRes = await fetch("/api/auth/google/url");
      const { url } = await urlRes.json();

      const authWindow = window.open(
        url,
        'google_oauth_popup',
        'width=600,height=700,status=no,resizable=yes,scrollbars=yes'
      );

      if (!authWindow) {
        throw new Error("POPUP_BLOCKED");
      }

      return new Promise<any>((resolve, reject) => {
        let checkClosedInterval: any;
        
        const handleMessage = async (event: MessageEvent) => {
          const origin = event.origin;
          if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
            return;
          }

          if (event.data?.type === 'GOOGLE_OAUTH_SUCCESS') {
            const { idToken } = event.data;
            try {
              const credential = GoogleAuthProvider.credential(idToken);
              const result = await signInWithCredential(auth, credential);
              const user = result.user;
              if (user) {
                await saveUserData(user.uid, {
                  fullName: user.displayName || 'Google Yurttaşı',
                  email: user.email || ''
                });
              }
              cleanup();
              resolve(user);
            } catch (authError) {
              cleanup();
              reject(authError);
            }
          }
        };

        const cleanup = () => {
          window.removeEventListener('message', handleMessage);
          if (checkClosedInterval) clearInterval(checkClosedInterval);
        };

        window.addEventListener('message', handleMessage);

        checkClosedInterval = setInterval(() => {
          if (authWindow.closed) {
            cleanup();
            reject(new Error("POPUP_CLOSED_BY_USER"));
          }
        }, 1000);
      });
    }

    console.log("[Firebase Auth] Custom Google Cloud OAuth not configured. Falling back to default Web SDK popups.");
    // Check if user is on a mobile/tablet touch device where popups are blocked/problematic by default
    const isMobile = typeof navigator !== 'undefined' && 
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
       (navigator.maxTouchPoints && navigator.maxTouchPoints > 2));
       
    if (isMobile) {
      console.log("[Firebase Auth] Mobile platform detected. Invoking top-level signInWithRedirect.");
      await signInWithRedirect(auth, googleProvider);
      return null;
    }

    console.log("[Firebase Auth] Desktop platform detected. Initiating signInWithPopup.");
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      await saveUserData(user.uid, {
        fullName: user.displayName || 'Google Yurttaşı',
        email: user.email || ''
      });
    }
    return user;
  } catch (error: any) {
    if (error?.message === "POPUP_BLOCKED" || error?.message === "POPUP_CLOSED_BY_USER") {
      throw error;
    }
    console.warn("[Firebase Auth] Popup authentication failed or blocked. Trying redirect flow fallback...", error);
    
    // Fall back to redirect-based authentication flow if popup is blocked, cancelled, or tracking prevention blocks cookie writes
    try {
      await signInWithRedirect(auth, googleProvider);
      return null;
    } catch (redirectError) {
      console.error("[Firebase Auth] Cumulative Redirect fallback failure:", redirectError);
      throw redirectError;
    }
  }
}

export async function logoutUser() {
  localStorage.removeItem('guest_user');
  await signOut(auth).catch(e => console.error("Firebase auth logout error: ", e));
}

// ========================
// REAL-TIME MULTIPLAYER LOBBY HANDLERS
// ========================

// Create a new lobby session
export async function createMultiplayerLobby(lobbyCode: string, user: any) {
  const path = `lobbies/${lobbyCode}`;
  try {
    await setDoc(doc(db, 'lobbies', lobbyCode), {
      hostUid: user.uid,
      hostName: user.displayName || 'Anonim Lider',
      lobbyCode: lobbyCode,
      status: 'LOBBY',
      createdAt: serverTimestamp()
    });
    
    // Add host as first member too
    await setDoc(doc(db, 'lobbies', lobbyCode, 'members', user.uid), {
      uid: user.uid,
      playerName: user.displayName || 'Grup Lideri',
      partyName: '',
      shortName: '',
      color: '#3b82f6',
      ideology: 'Sosyal Demokrat',
      isHost: true,
      ready: false,
      currentWeek: 1,
      support: 0.1,
      budget: 3000000,
      online: true
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Join an existing lobby code
export async function joinMultiplayerLobby(lobbyCode: string, user: any) {
  const path = `lobbies/${lobbyCode}`;
  try {
    const lSnap = await getDoc(doc(db, 'lobbies', lobbyCode));
    if (!lSnap.exists()) {
      throw new Error("LOBBY_NOT_FOUND");
    }
    
    // Check if campaign already started
    if (lSnap.data().status !== 'LOBBY') {
      throw new Error("CAMPAIGN_ALREADY_STARTED");
    }

    // Add joined player as member
    await setDoc(doc(db, 'lobbies', lobbyCode, 'members', user.uid), {
      uid: user.uid,
      playerName: user.displayName || 'Yeni Aday',
      partyName: '',
      shortName: '',
      color: '#ec4899',
      ideology: 'Sosyal Demokrat',
      isHost: false,
      ready: false,
      currentWeek: 1,
      support: 0.1,
      budget: 3000000,
      online: true
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Set continuous sync listener for members list
export function listenToLobbyMembers(lobbyCode: string, onUpdate: (members: any[]) => void) {
  const ref = collection(db, 'lobbies', lobbyCode, 'members');
  return onSnapshot(ref, (snap) => {
    const members = snap.docs.map(d => d.data());
    onUpdate(members);
  }, (err) => {
    console.error("listenToLobbyMembers error: ", err);
  });
}

// Set continuous sync listener for lobby document itself (to detect start game trigger)
export function listenToLobbyDoc(lobbyCode: string, onUpdate: (lobby: any) => void) {
  const ref = doc(db, 'lobbies', lobbyCode);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      onUpdate(snap.data());
    }
  }, (err) => {
    console.error("listenToLobbyDoc error: ", err);
  });
}

// Set continuous sync listener for messages in the lobby chat
export function listenToLobbyChat(lobbyCode: string, onUpdate: (messages: any[]) => void) {
  const ref = collection(db, 'lobbies', lobbyCode, 'chat');
  const q = query(ref, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    onUpdate(messages);
  }, (err) => {
    console.error("listenToLobbyChat error: ", err);
  });
}

// Send chat message in lobby / active game in real time
export async function sendLobbyChatMessage(lobbyCode: string, senderName: string, text: string) {
  const path = `lobbies/${lobbyCode}/chat`;
  try {
    await addDoc(collection(db, 'lobbies', lobbyCode, 'chat'), {
      sender: senderName,
      text: text,
      timestamp: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Update lobby member custom party information
export async function updateLobbyMemberParty(lobbyCode: string, uid: string, partyData: any) {
  const path = `lobbies/${lobbyCode}/members/${uid}`;
  try {
    await setDoc(doc(db, 'lobbies', lobbyCode, 'members', uid), partyData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Start campaign for the whole lobby (triggered by Host)
export async function startLobbyGame(lobbyCode: string) {
  const path = `lobbies/${lobbyCode}`;
  try {
    await setDoc(doc(db, 'lobbies', lobbyCode), {
      status: 'CAMPAIGN',
      campaignStartedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Sync active weekly progress metrics so other players see your progress live
export async function updateLobbyMemberProgress(
  lobbyCode: string,
  uid: string,
  support: number,
  budget: number,
  currentWeek: number
) {
  const path = `lobbies/${lobbyCode}/members/${uid}`;
  try {
    await setDoc(doc(db, 'lobbies', lobbyCode, 'members', uid), {
      support,
      budget,
      currentWeek,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
