import {Client,Account,ID, Avatars, Databases, Query,Storage } from 'react-native-appwrite'

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.native.aora',
    projectId: '6624ee911770ce09ad84',
    databaseId: '6624f066e6379a632420',
    userCollectionId: '6624f08cf272c6c6b292',
    videoCollectionId: '6624f0be365742355a55',
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
const storage = new Storage(client);

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
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
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
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if (!currrentUser) throw Error;
        return currrentUser.documents[0];
    }
    catch (err) {
        console.log(err);
    }
}

export async function getAllPost() {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.videoCollectionId, [Query.orderDesc('$createdAt')])
        return posts.documents
    }
    catch (err) {
        console.log(err)
    }
}

export async function getLatestPost() {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.videoCollectionId, [Query.orderDesc('$createdAt',Query.limit(7))])
        return posts.documents
    }
    catch (err) {
        console.log(err)
    }
}

export async function searchPost(query) {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.videoCollectionId, [Query.search('title',query)])
        return posts.documents
    }
    catch (err) {
        console.log(err)
    }
}

export async function getUserPosts(userId) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        appwriteConfig.userCollectionId,
        [Query.equal("creator", userId)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
}
  

export async function signOut() {
    try {
        const session = await account.deleteSession('current')
        return session
    }
    catch (err) {
        console.log(err)
    }
}

export async function getFilePreview(fileId,type) {
    let fileUrl;
    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100);
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    }
    catch (err) {
        throw new Error(err);
    }
}

export async function uploadFile(file,type) {
    if (!file) return;
    const asset = {
        name:file.fileName,
        type:file.mimeType,
        size:file.fileSize,
        uri:file.uri
    };
    try {
        const uploadFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );
        const fileUrl = await getFilePreview(uploadedFile.$id, type)
        return fileUrl
    }
    catch (err) {
        throw new Error(err);
    }
}

export async function createVideo() {
    try{
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newPost = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, ID.unique(), {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            creator:form.userId
        })
        return newPost
    }
    catch (err) {
        throw new Error(err)
    }
}