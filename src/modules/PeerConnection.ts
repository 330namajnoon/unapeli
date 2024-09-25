import { STUN_SERVER } from "../constants";

export interface Connection {
  id: string;
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  senders: RTCRtpSender[];
}

class PeerConnection {
  iseServer: string;
  connections: Connection[] = [];

  constructor() {
    this.iseServer = STUN_SERVER;
  }

  createConnection({
    id,
    onicecandidate,
    ontrack,
    onconnectionstatechange,
  }: {
    id: string;
    onicecandidate: (event: RTCPeerConnectionIceEvent) => void;
    ontrack: (event: RTCTrackEvent) => void;
    onconnectionstatechange: (this: RTCPeerConnection, ev: Event) => void;
  }) {
    const connection = new RTCPeerConnection({
      iceServers: [{ urls: this.iseServer }],
    });
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        onicecandidate(event);
      }
    };
    connection.onconnectionstatechange = onconnectionstatechange;
    let dataChannel = connection.createDataChannel("dataChannel");
    connection.ondatachannel = (event) => {
      dataChannel = event.channel;
      dataChannel.onmessage = (event) => {
        console.log(event.data);
      };
    };
    connection.ontrack = ontrack;
    this.connections.push({ id, connection, dataChannel, senders: [] });
    return connection;
  }

  getConnection(id: string) {
    return this.connections.find((connection) => connection.id === id);
  }

  addStream(id: string, stream: MediaStream) {
    const connection = this.getConnection(id);
    if (!connection) return;
    connection.senders?.forEach((sender) => {
      connection.connection.removeTrack(sender);
    });
    stream.getTracks().forEach((track) => {
      connection.senders.push(connection.connection.addTrack(track, stream));
    });
    connection.connection.getSenders().forEach(sender => {
      if (sender?.track?.kind === 'video') {
        const parameters = sender.getParameters();
        if (!parameters.encodings) {
          parameters.encodings = [{}];
        }
        parameters.encodings[0].maxBitrate = 2500000;  // Bitrate máximo para video (2.5 Mbps)
        sender.setParameters(parameters);
      }
    
      if (sender?.track?.kind === 'audio') {
        const parameters = sender.getParameters();
        if (!parameters.encodings) {
          parameters.encodings = [{}];
        }
        parameters.encodings[0].maxBitrate = 128000;  // Bitrate máximo para audio (128 kbps)
        sender.setParameters(parameters);
      }
    });
  }

  deleteConnection(id: string) {
    this.connections = this.connections.filter(
      (connection) => connection.id !== id
    );
  }

  async createOffer(id: string) {
    const connection = this.getConnection(id);
    if (!connection) return;
    const offer = await connection.connection.createOffer();
    connection.connection.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }

  async createAnswer(id: string, offer: RTCSessionDescriptionInit) {
    const connection = this.getConnection(id);
    if (!connection) return;
    connection.connection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await connection.connection.createAnswer();
    connection.connection.setLocalDescription(
      new RTCSessionDescription(answer)
    );
    return answer;
  }

  async setRemoteDescription(
    id: string,
    description: RTCSessionDescriptionInit
  ) {
    const connection = this.getConnection(id);
    if (!connection) return;
    return connection.connection.setRemoteDescription(
      new RTCSessionDescription(description)
    );
  }

  async addIceCandidate(id: string, candidate: RTCIceCandidateInit) {
    const connection = this.getConnection(id);
    if (!connection) return;
    await connection.connection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  async setIseCandidate(id: string, candidate: RTCIceCandidateInit) {
    const connection = this.getConnection(id);
    if (!connection) return;
    await connection.connection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  async closeConnection(id: string) {
    const connection = this.getConnection(id);
    if (!connection) return;
    connection.connection.close();
    this.deleteConnection(id);
  }
}

export default PeerConnection;
