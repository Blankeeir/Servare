// util/ipfs.ts
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export const addFile = async (file: Buffer) => {
    try {
        const result = await ipfs.add(file);
        return result.path;
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw error;
    }
};

export const getFile = async (hash: string) => {
    try {
        const file = [];
        for await (const chunk of ipfs.cat(hash)) {
            file.push(chunk);
        }
        return Buffer.concat(file);
    } catch (error) {
        console.error('Error fetching file from IPFS:', error);
        throw error;
    }
};