import { getStorage, ref, listAll, getDownloadURL } from '@firebase/storage';
import { images } from '../../firebaseConfig';
const storage = getStorage();
const getImages = {
    getApple: async (type) => {
        try {
            const imagesRef = ref(storage, `Products/Apple/${type}`);
            const res = await listAll(imagesRef);
    
            const promises = res.items.map((itemRef) => getDownloadURL(itemRef));
            const urls = await Promise.all(promises);
            
            return urls;
        } catch (error) {
            console.log('Error fetching Apple images:', error);
            return [];
        }
    }
}
export default getImages

