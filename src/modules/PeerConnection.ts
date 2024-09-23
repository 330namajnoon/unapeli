import { STUN_SERVER } from "../constants";

export interface Connection {
  id: string;
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
}

class PeerConnection {
  iseServer: string;
  connections: Connection[] = [];

  constructor() {
    this.iseServer = STUN_SERVER;
  }

  createConnection(
    id: string,
    onicecandidate = (event: RTCPeerConnectionIceEvent) => {},
    ontrack = (event: RTCTrackEvent) => {}
  ) {
    const connection = new RTCPeerConnection({
      iceServers: [{ urls: this.iseServer }],
    });
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        onicecandidate(event);
      }
    };
    let dataChannel = connection.createDataChannel("dataChannel");
    connection.ondatachannel = (event) => {
      dataChannel = event.channel;
      dataChannel.onmessage = (event) => {
        console.log(event.data);
      };
    };
    connection.ontrack = ontrack;
    this.connections.push({ id, connection, dataChannel });
    return connection;
  }

  getConnection(id: string) {
    return this.connections.find((connection) => connection.id === id);
  }

  addStream(id: string, stream: MediaStream) {
    const connection = this.getConnection(id);
    if (!connection) return;
    stream.getTracks().forEach((track) => {
      connection.connection.addTrack(track, stream);
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
