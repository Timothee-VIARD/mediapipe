const servers = {
    iceServers: [
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
    iceCandidatePoolSize: 10,
  };
  
  const pc = new RTCPeerConnection(servers);
  let remoteStream = new MediaStream();
  
  export { pc, remoteStream };