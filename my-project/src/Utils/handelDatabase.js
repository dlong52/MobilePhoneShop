import { getDatabase, ref, child, get, set, push, remove, update } from "firebase/database";
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
                productData.id = snapshot.key; // Add the 'id' field with the key
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
    fetchCartData: async (user) => {
        if (user) {
            const userRef = ref(db, `Users/${user.uid}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists() && snapshot.val().cart) {
                    const userData = snapshot.val();
                    const userCart = userData.cart;
                    const dataArray = Object.keys(userCart).map((key) => ({ id: key, ...userCart[key] }));
                    if (dataArray)
                        return dataArray
                    else
                        return [];
                } else {
                    console.log("Giỏ hàng trống");
                    return []
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu từ cơ sở dữ");
            }
        }
    },
    fetchUserDataByCode: async (code) => {
        try {
            const productRef = child(dbRef, `Users/${code}`);
            const snapshot = await get(productRef);
            if (snapshot.exists()) {
                const productData = snapshot.val();
                productData.uid = snapshot.key;
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
    },
    addToCart: async (item, user, notify, updateUi) => {
        try {
            const db = getDatabase(app);
            const userRef = ref(db, `Users/${user.uid}/cart`);

            // Fetch the current cart data
            const cartSnapshot = await get(userRef);
            const cartData = cartSnapshot.val();
            const cartArray = cartData ? Object.keys(cartData).map((key) => ({ id: key, ...cartData[key] })) : [];

            let itemExists = false;

            if (cartArray.length > 0) {
                // Loop through the cart items to check if the item already exists
                for (const itemData of cartArray) {
                    if (itemData.version.v_name === item.version.v_name && itemData.color === item.color) {
                        // Item already exists, update the quantity
                        const itemRef = ref(db, `Users/${user.uid}/cart/${itemData.id}`);
                        await update(itemRef, { quantity: itemData.quantity + 1 });
                        itemExists = true;
                        break;
                    }
                }
            }

            if (!itemExists) {
                await push(userRef, { ...item, quantity: 1 });
            }

            console.log(cartArray);
            console.log(item);
            notify("Thêm vào giỏ hàng thành công", "success");
            updateUi();
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    },
    createOrder: async (user, order, productOrder) => {
        try {
            const newOrderRef = push(ref(db, 'Orders'));
            const newOrderId = newOrderRef.key;

            const orderDetails = {
                ...order,
                user_id: user?.uid,
                order_id: newOrderId
            };

            await set(newOrderRef, orderDetails);

            const userOrdersRef = ref(db, `Users/${user?.uid}/orders/${newOrderId}`);
            await set(userOrdersRef, true);

            for (const item of productOrder) {
                const productRef = ref(db, `Products/${item.id}/sold`);
                const productQuantityRef = ref(db, `Products/${item.id}/quantity`);

                const currentSoldSnapshot = await get(productRef);
                const currentQuantitySnapshot = await get(productQuantityRef);

                const currentSold = currentSoldSnapshot.val() || 0;
                const currentQuantity = currentQuantitySnapshot.val() || 0;

                await Promise.all([
                    set(productQuantityRef, currentQuantity - item.quantity),
                    set(productRef, currentSold + item.quantity)
                ]);
            }

            if (user?.uid) {
                const userCartRef = ref(db, `Users/${user.uid}/cart`);
                await set(userCartRef, null);
            } else {
                console.error("User UID is undefined. Cannot clear cart.");
            }
            alert("Đặt hàng thành công")
            window.location.href = "/"
        } catch (error) {
            console.error("Error processing order:", error);
        }
    },
    fetchBrandData: async () => {
        try {
            const snapshot = await get(child(dbRef, `Brand`));
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



    deleteCartItem: (user, id, updateUi) => {
        const userCartRef = ref(db, `Users/${user.uid}/cart`);
        const itemRef = child(userCartRef, id);
        remove(itemRef)
            .then(() => {
                updateUi()
                console.log("Successfully deleted");
            })
            .catch((error) => {
                console.error("Error removing item: ", error);
            });
    },
    savePhoneNumber: (user, phoneNumber) => {
        const db = getDatabase(app);
        const userPhoneRef = ref(db, `Users/${user.uid}`);
        update(userPhoneRef, { phoneNumber: phoneNumber })
            .then(() => {
                console.log("Phone number updated successfully");
            })
            .catch((error) => {
                console.error("Failed to update phone number:", error);
            });
    },
    createAddress: (user, address) => {
        const userRef = ref(db, `Users/${user.uid}`);
        update(userRef, { address: address })
            .then(() => {
                console.log("Address updated successfully");
            })
            .catch((error) => {
                console.error("Failed to update address:", error);
            });
    }

}
export default database