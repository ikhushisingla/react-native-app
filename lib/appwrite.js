import {Client,Account,ID, Avatars, Databases, Query } from 'react-native-appwrite'

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.native.aora',
    projectId: '6624ee911770ce09ad84',
    databaseId: '6624f066e6379a632420',
    userCollectionId: '6624f08cf272c6c6b292',
    videCollectionId: '6624f0be365742355a55',
    storageId: '6624f231608bb05e0c02'
}

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);
  
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser (email,password,username){
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);
        
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar:avatarUrl
            }
        )
        return newUser
    }
    catch (err) {
        console.log(err);
    }
}

export async function signIn (email, password) {
    try {
        const session = await account.createEmailSession(email, password)
        
        return session;
    }
    catch (err) {
        console.log(err);
    }
}

export async function getCurrentUser () {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;
        const currrentUser = databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if (!currrentUser) throw Error;
        return currrentUser.documents[0];
    }
    catch (err) {
        console.log(err);
    }
}