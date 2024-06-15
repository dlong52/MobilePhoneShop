import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { images as storage } from '../../firebaseConfig';
import database from '../Utils/handelDatabase';
import helpers from '../Utils/helpers';

const BrandForm = ({ updateUi, notify, show }) => {
    const [brand, setBrand] = useState({
        id: uuidv4(),
        image: '',
        name: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBrand({ ...brand, [name]: value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const imageRef = ref(storage, `Brands/${file.name + uuidv4()}`);
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
        const newBrand = {
            ...brand,
            id: uuidv4(), 
            created_at: helpers.getCurrentTime()
        };
        await database.createBrand(newBrand, notify);
        setBrand({ id: uuidv4(), image: '', name: '' });
        updateUi();
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 bg-white rounded-md">
            <div className="flex justify-between">
                <h2 className="text-[20px] font-semibold">Add New Brand</h2>
                <button type='button' onClick={() => { show(false) }}><i className="text-[#100e3d] fa-solid fa-circle-arrow-left fa-xl"></i></button>
            </div>
            <div className="mt-4">
                <input type="text" name="name" value={brand.name} onChange={handleInputChange} placeholder="Brand Name" className="w-full mb-2 px-3 py-2 border rounded" />
                <div className="mt-2">
                    <input type="file" onChange={handleImageUpload} className="w-full mb-2 px-3 py-2 border rounded" />
                    {brand.image && <img src={brand.image} alt="Brand" className="mt-2 w-full h-auto" />}
                </div>
                <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Add Brand</button>
            </div>
        </form>
    );
};

export default BrandForm;
