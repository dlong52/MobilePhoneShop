import { getDatabase, ref, child, get,query,orderByChild,equalTo , set, push, remove, update } from "firebase/database";
import { app, auth } from "../../firebaseConfig";
const dbRef = ref(getDatabase());
const db = getDatabase(app);

const database = {
    fetchProductsData: async () => {
        try {
            const snapshot = await get(child(dbRef, `Products`));
            if (snapshot.exists()) {
                const dataArray = Object.keys(snapshot.val()).map((key) => ({ id: key, ...snapshot.val()[key] }));
                return dataArray;
            } else {
                console.log("No data available");
                return null;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    },
    fetchProductDataByCode: async (code) => {
        try {
            const productRef = child(dbRef, `Products/${code}`);
            const snapshot = await get(productRef);
            if (snapshot.exists()) {
                const productData = snapshot.val();
                return productData;
            } else {
                console.log("No product available for code:", code);
                return null;
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
            return null;
        }
    },
    createProduct: async (product, notify) => {
        const productRef = ref(db, `Products`);
        try {
            if (!product) {
                throw new Error("Product data is missing.");
            }
            await push(productRef, product);
            console.log('Product added to Products collection successfully');
            notify("Product added to Products collection successfully", "success");

        } catch (error) {
            console.error('Error adding product to Products collection:', error);
            alert('Error adding product to Products collection: ' + error.message);
        }
    },
    createBrand: async (product, notify) => {
        const productRef = ref(db, `Brand`);
        try {
            if (!product) {
                throw new Error("Product data is missing.");
            }
            await push(productRef, product);
            console.log('Product added to Products collection successfully');
            notify("Brand added to Brands collection successfully", "success");

        } catch (error) {
            console.error('Error adding product to Products collection:', error);
            alert('Error adding product to Products collection: ' + error.message);
        }
    },
    updateProduct: (id, productUpdate, notify) => {
        const productRef = ref(db, `Products`);
        if (id) {
            const newproduct = productUpdate
            const productUpdateRef = child(productRef, id);
            update(productUpdateRef, newproduct)
                .then(() => {
                    notify("Product updated successfully", "success");
                })
                .catch((error) => {
                    console.error("Failed to update product:", error);
                });
        }
    },
    updateBrand: (id, productUpdate, notify) => {
        const productRef = ref(db, `Brand`);
        if (id) {
            const newproduct = productUpdate
            const productUpdateRef = child(productRef, id);
            update(productUpdateRef, newproduct)
                .then(() => {
                    notify("Product updated successfully", "success");
                })
                .catch((error) => {
                    console.error("Failed to update product:", error);
                });
        }
    },
    deleteProduct: (id, updateUi, notify, showConfirmDeleteProduct) => {
        const productRef = ref(db, `Products`);
        const itemRef = child(productRef, id);
        remove(itemRef)
            .then(() => {
                updateUi()
                showConfirmDeleteProduct()
                notify("Product deleted", "success")
            })
            .catch((error) => {
                console.error("Error removing item: ", error);
            });
    },
    deleteCategory: async (id, updateUi, notify, showConfirmDeleteCategory) => {
        try {
            // Step 1: Reference to the products
            const productsRef = ref(db, 'Products');
            
            // Step 2: Query to find all products with the specified category ID
            const productsQuery = query(productsRef, orderByChild('brand'), equalTo(id));
    
            // Step 3: Fetch products matching the query
            const snapshot = await get(productsQuery);
    
            if (snapshot.exists()) {
                // Step 4: Loop through each product and delete it
                snapshot.forEach((childSnapshot) => {
                    const productRef = child(productsRef, childSnapshot.key);
                    remove(productRef).catch((error) => {
                        console.error("Error removing product: ", error);
                    });
                });
            }
    
            // Step 5: Now delete the category itself
            const categoryRef = ref(db, `Brand/${id}`);
            await remove(categoryRef);
    
            // Step 6: Update UI, show confirmation, and notify user
            updateUi();
            showConfirmDeleteCategory();
            notify("Category and associated products deleted", "success");
        } catch (error) {
            console.error("Error removing category and products: ", error);
            notify("Failed to delete category and associated products", "error");
        }
    },
    
    fetchOrdersData: async () => {
        try {
            const snapshot = await get(child(dbRef, `Orders`));
            if (snapshot.exists()) {
                const dataArray = Object.keys(snapshot.val()).map((key) => ({ id: key, ...snapshot.val()[key] }));
                return dataArray;
            } else {
                console.log("No data available");
                return null;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    },
    fetchMyOrdersData: async (user) => {
        if (user) {
            const userRef = ref(db, `Users/${user.uid}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists() && snapshot.val().orders) {
                    const userData = snapshot.val();
                    const userCart = userData.orders;
                    const dataArray = Object.keys(userCart).map((key) => ({ id: key, ...userCart[key] }));
                    if (dataArray)
                        return dataArray
                    else
                        return [];
                } else {
                    console.log("Đơn hàng trống");
                    return []
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu từ cơ sở dữ");
            }
        }
    },
    fetchOrderDataByCode: async (code) => {
        try {
            const productRef = child(dbRef, `Orders/${code}`);
            const snapshot = await get(productRef);
            if (snapshot.exists()) {
                const productData = snapshot.val();
                return productData;
            } else {
                console.log("No product available for code:", code);
                return null;
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
            return null;
        }
    },
    cancelMyOrder: async (user, orderId, updateUi) => {
        try {
            // Cập nhật trạng thái của đơn hàng trong nút Orders
            const orderRef = ref(db, `Orders/${orderId}`);
            await update(orderRef, { status: "cancelled" });

            // Cập nhật trạng thái của đơn hàng trong field orders của user
            const userOrdersRef = ref(db, `Users/${user?.uid}/orders/${orderId}`);
            await set(userOrdersRef, false);
            updateUi()
            console.log("Đã hủy đơn hàng thành công.");
            return true;
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            return false;
        }
    },
    handelUpdateStatus: async (orderId, status, receivedDate, updateUi) => {
        const orderRef = ref(db, `Orders/${orderId}`);
        try {
            const snapshot = await get(orderRef);
            if (snapshot.exists()) {
                // Get the current order data
                const orderData = snapshot.val();

                // Create an object containing the updated status
                let updatedData = {
                    ...orderData,
                    status: status
                };

                // Conditionally handle receivedDate and cancellationDate based on status
                if (status === 'processing') {
                    if (updatedData.receivedDate)
                        delete updatedData.receivedDate;
                    if (updatedData.cancelledDate)
                        delete updatedData.cancellationDate;
                } else if (status === 'delivered') {
                    updatedData.receivedDate = receivedDate;
                    if (updatedData.cancellationDate) // Set receivedDate
                        delete updatedData.cancellationDate;
                } else if (status === 'cancelled') {
                    if (updatedData.receivedDate)
                        delete updatedData.receivedDate;
                    updatedData.cancellationDate = receivedDate; // Assume receivedDate is used as cancellationDate
                }

                // Update the order data
                await set(orderRef, updatedData);
                console.log("Successfully updated order status.");
                updateUi()
                // window.location.reload(); // Reload the page after a successful update if necessary
            } else {
                console.log("Order does not exist or has been deleted.");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    },
    fetchBrandData: async () => {
        try {
            const snapshot = await get(child(dbRef, `Brand`));
            if (snapshot.exists()) {
                const dataArray = Object.keys(snapshot.val()).map((key) => ({ b_id: key, ...snapshot.val()[key] }));
                return dataArray;
            } else {
                console.log("No data available");
                return null;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    },
    fetchUsersData: async () => {
        try {
            const snapshot = await get(child(dbRef, `Users`));
            if (snapshot.exists()) {
                const dataArray = Object.keys(snapshot.val()).map((key) => ({ id: key, ...snapshot.val()[key] }));
                return dataArray;
            } else {
                console.log("No data available");
                return null;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    },
    fetchUserDataByCode: async (code) => {
        try {
            const productRef = child(dbRef, `Users/${code}`);
            const snapshot = await get(productRef);
            if (snapshot.exists()) {
                const productData = snapshot.val();
                return productData;
            } else {
                console.log("No product available for code:", code);
                return null;
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
            return null;
        }
    },
    handelUpdateRole: (id, role, updateUi) => {
        const userRef = ref(db, `Users/${id}`);
        update(userRef, { role: role })
            .then(() => {
                updateUi()
                console.log("Phone number updated successfully");
            })
            .catch((error) => {
                console.error("Failed to update phone number:", error);
            });
    },
    getAddress: async (user) => {
        if (user) {
            const userRef = ref(db, `Users/${user.uid}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const userAddress = userData.address;
                    if (userAddress)
                        return userAddress
                    else
                        return false;
                } else {
                    console.log("Dữ liệu không tồn tại");
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu từ cơ sở dữ");
            }
        }
    },
    getPhone: async (user) => {
        if (user) {
            const userRef = ref(db, `Users/${user.uid}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const userPhone = userData.phoneNumber;
                    if (userPhone)
                        return userPhone
                    else
                        return false;
                } else {
                    console.log("Dữ liệu không tồn tại");
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu từ cơ sở dữ");
            }
        }
    }

}
export default database