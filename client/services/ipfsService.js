import { create } from 'ipfs-http-client';

export class IPFSService {
  constructor() {
    // Connect to public IPFS gateway
    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    });
  }

  async uploadImage(file) {
    try {
      // Convert base64 to buffer
      const buffer = Buffer.from(
        file.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      );

      const result = await this.ipfs.add(buffer);
      return `https://ipfs.io/ipfs/${result.path}`;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
    }
  }

  async uploadMetadata(metadata) {
    try {
      const data = JSON.stringify(metadata);
      const result = await this.ipfs.add(data);
      return `https://ipfs.io/ipfs/${result.path}`;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw error;
    }
  }
} 