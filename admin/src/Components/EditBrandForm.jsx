import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { images as storage } from '../../firebaseConfig';
import database from '../Utils/handelDatabase';
import helpers from '../Utils/helpers';

const EditBrandForm = ({ brandData, updateUi, notify, show }) => {
    const [brand, setBrand] = useState({
        id: '',
        image: '',
        name: ''
    });

    useEffect(() => {
        setBrand(brandData);
    }, [brandData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBrand({ ...brand, [name]: value });
    };

    const sanitizeFileName = (fileName) => {
        return fileName.replace(/[.#$[\]]/g, '');
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const sanitizedFileName = sanitizeFileName(file.name);
        const uniqueFileName = `${sanitizedFileName}_${uuidv4()}`;
        const imageRef = ref(storage, `Brands/${uniqueFileName}`);
        await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(imageRef);
        setBrand({ ...brand, image: imageUrl });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!brand.name || !brand.image) {
            alert('Please fill in all required fields.');
            return;
        }
        const updatedBrand = {
            ...brand,
            updated_at: helpers.getCurrentTime()
        };
        await database.updateBrand(brandData?.b_id, updatedBrand, notify);
        updateUi();
        show(false);
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 bg-white rounded-md">
            <div className="flex justify-between">
                <h2 className="text-[20px] font-semibold">Edit Brand</h2>
                <button type='button' onClick={() => show(false)}><i className="text-[#100e3d] fa-solid fa-circle-arrow-left fa-xl"></i></button>
            </div>
            <div className="mt-4">
                <input
                    type="text"
                    name="name"
                    value={brand?.name}
                    onChange={handleInputChange}
                    placeholder="Brand Name"
                    className="w-full mb-2 px-3 py-2 border rounded"
                />
                <div className="mt-2">
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        className="w-full mb-2 px-3 py-2 border rounded"
                    />
                    {brand?.image && <img src={brand?.image} alt="Brand" className="mt-2 h-[80px] shadow-lg" />}
                </div>
                <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Update Brand</button>
            </div>
        </form>
    );
};

export default EditBrandForm;
