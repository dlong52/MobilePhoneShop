import React, { useState } from 'react';
import { images as storage } from '../../firebaseConfig';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import helpers from '../Utils/helpers';
import database from '../Utils/handelDatabase';

export const CreateForm = ({ updateUi, show, brandsData, notify }) => {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        code: '',
        description: '',
        quantity: '',
        brand: '',
        discount: '',
        oustanding: false,
        configuration: {
            ram: '',
            screen: '',
            capacity: ''
        },
        images: [],
        colors: [],
        version: [
            { v_name: '', price: '' },
            { v_name: '', price: '' }
        ],
        created_at: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            configuration: { ...product.configuration, [name]: value }
        });
    };

    const handleVersionChange = (index, e) => {
        const { name, value } = e.target;
        const newVersions = [...product.version];
        newVersions[index][name] = value;
        setProduct({ ...product, version: newVersions });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const urls = await Promise.all(files.map(async (file) => {
            const imageRef = ref(storage, `Products/${file.name + uuidv4()}`);
            await uploadBytes(imageRef, file);
            return getDownloadURL(imageRef);
        }));
        setProduct((prevProduct) => ({
            ...prevProduct,
            images: [...prevProduct.images, ...urls]
        }));
    };

    const removeImageInput = (index) => {
        const newImages = product.images.filter((_, i) => i !== index);
        setProduct({ ...product, images: newImages });
    };

    const handleColorChange = (e) => {
        const { value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            colors: [...prevProduct.colors, value]
        }));
    };

    const removeColor = (index) => {
        const newColors = product.colors.filter((_, i) => i !== index);
        setProduct({ ...product, colors: newColors });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!product.name || !product.price || !product.code || !product.description || !product.quantity || !product.brand) {
            alert('Please fill in all required fields.');
            return;
        }
        if (isNaN(product.price) || isNaN(product.quantity) || parseFloat(product.price) <= 0 || parseInt(product.quantity) <= 0) {
            alert('Price and quantity must be positive numbers.');
            return;
        }
       
        if (product.images.length === 0) {
            alert('Please upload at least one image.');
            return;
        }
        const newProduct = {
            ...product,
            created_at: helpers.getCurrentTime()
        };
        await database.createProduct(newProduct,notify);
        setProduct({
            name: '',
            price: '',
            code: '',
            description: '',
            quantity: '',
            brand: '',
            discount: '',
            oustanding: false,
            configuration: {
                ram: '',
                screen: '',
                capacity: ''
            },
            images: [],
            colors: [],
            version: [
                { v_name: '', price: '' },
                { v_name: '', price: '' }
            ],
            created_at: ''
        });
        updateUi(); 
        show(false); 
    };
    return (
        <form  className="p-5 bg-white rounded-md">
            <div className="flex justify-between">
                <h2 className="text-[20px] font-semibold">Add New Product</h2>
                <button onClick={()=>{show()}}><i class="text-[#100e3d] fa-solid fa-circle-arrow-left fa-xl"></i></button>
            </div>
            <div className="mt-4">
                <input type="text" name="name" value={product.name} onChange={handleInputChange} placeholder="Name" className="w-full mb-2 px-3 py-2 border rounded" />
                <input type="number" name="price" value={product.price} onChange={handleInputChange} placeholder="Price" className="w-full mb-2 px-3 py-2 border rounded" />
                <input type="text" name="code" value={product.code} onChange={handleInputChange} placeholder="Code" className="w-full mb-2 px-3 py-2 border rounded" />
                <textarea name="description" value={product.description} onChange={handleInputChange} placeholder="Description" className="w-full mb-2 px-3 py-2 border rounded"></textarea>
                <input type="number" name="quantity" value={product.quantity} onChange={handleInputChange} placeholder="Quantity" className="w-full mb-2 px-3 py-2 border rounded" />
                <select name="brand" value={product.brand} onChange={handleInputChange} className="w-full mb-2 px-3 py-2 border rounded">
                    <option value="">Select Brand</option>
                    {brandsData.map((brand, index) => (
                        <option key={index} value={brand.name}>{brand.name}</option>
                    ))}
                </select>
                <input type="text" name="discount" value={product.discount} onChange={handleInputChange} placeholder="Discount" className="w-full mb-2 px-3 py-2 border rounded" />
                <label className="block mb-2">
                    <input type="checkbox" name="oustanding" checked={product.oustanding} onChange={(e) => setProduct({ ...product, oustanding: e.target.checked })} />
                    Outstanding
                </label>
                <div className="mt-4">
                    <h3 className="text-[16px] font-semibold">Configuration</h3>
                    <input type="text" name="ram" value={product.configuration.ram} onChange={handleConfigChange} placeholder="RAM" className="w-full mb-2 px-3 py-2 border rounded" />
                    <input type="text" name="screen" value={product.configuration.screen} onChange={handleConfigChange} placeholder="Screen" className="w-full mb-2 px-3 py-2 border rounded" />
                    <input type="text" name="capacity" value={product.configuration.capacity} onChange={handleConfigChange} placeholder="Capacity" className="w-full mb-2 px-3 py-2 border rounded" />
                </div>
                <div className="mt-4">
                    <h3 className="text-[16px] font-semibold">Images</h3>
                    {product.images.map((image, index) => (
                        <div key={index} className="flex mb-2 items-center">
                            <input type="text" value={image} readOnly className="w-full px-3 py-2 border rounded" />
                            <button type="button" onClick={() => removeImageInput(index)} className="ml-2 bg-red-500 text-white px-3 py-1 rounded">Remove</button>
                        </div>
                    ))}
                    <input type="file" multiple onChange={handleImageUpload} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded" />
                </div>
                <div className="mt-4">
                    <h3 className="text-[16px] font-semibold">Colors</h3>
                    {product.colors.map((color, index) => (
                        <div key={index} className="flex mb-2 items-center">
                            <input type="text" value={color} readOnly className="w-full px-3 py-2 border rounded" />
                            <button type="button" onClick={() => removeColor(index)} className="ml-2 bg-red-500 text-white px-3 py-1 rounded">Remove</button>
                        </div>
                    ))}
                    <input type="text" name="color" onBlur={handleColorChange} placeholder="Add Color" className="w-full mb-2 px-3 py-2 border rounded" />
                </div>
                <div className="mt-4">
                    <h3 className="text-[16px] font-semibold">Versions</h3>
                    {product.version.map((v, index) => (
                        <div key={index} className="flex mb-2">
                            <input type="text" name="v_name" value={v.v_name} onChange={(e) => handleVersionChange(index, e)} placeholder="Version Name" className="w-1/2 px-3 py-2 border rounded mr-2" />
                            <input type="number" name="price" value={v.price} onChange={(e) => handleVersionChange(index, e)} placeholder="Version Price" className="w-1/2 px-3 py-2 border rounded" />
                        </div>
                    ))}
                </div>
                <button type="button" onClick={handleSubmit} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
            </div>
        </form>
    );
};
