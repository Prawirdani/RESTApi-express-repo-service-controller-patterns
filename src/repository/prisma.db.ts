import { PrismaClient } from '@prisma/client';

class PrismaDB {
    public _prismaClient: PrismaClient;

    constructor(){
        this._prismaClient = new PrismaClient();
    }
}

const prisma = new PrismaDB()._prismaClient;

export default prisma;

