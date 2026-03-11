import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Subscription {
    id: bigint;
    endDate: Time;
    userId: Principal;
    plan: SubscriptionPlan;
    isActive: boolean;
    startDate: Time;
}
export type Time = bigint;
export interface FoodItem {
    id: bigint;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    rating: number;
    price: number;
}
export interface CartItem {
    quantity: bigint;
    foodItem: FoodItem;
}
export interface Cart {
    items: Array<CartItem>;
}
export interface UserProfile {
    name: string;
    savedAddresses: Array<string>;
    email: string;
}
export interface OrderType {
    id: bigint;
    status: OrderStatus;
    deliveryAddress: string;
    userId: Principal;
    createdAt: Time;
    totalAmount: number;
    items: Array<CartItem>;
    distanceInKm: number;
}
export enum OrderStatus {
    preparing = "preparing",
    outForDelivery = "outForDelivery",
    orderPlaced = "orderPlaced",
    delivered = "delivered"
}
export enum SubscriptionPlan {
    monthlyCombo = "monthlyCombo",
    monthlyDinner = "monthlyDinner",
    weeklyDinner = "weeklyDinner",
    monthlyLunch = "monthlyLunch",
    weeklyCombo = "weeklyCombo",
    weeklyLunch = "weeklyLunch"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFoodItem(name: string, description: string, price: number, category: string, imageUrl: string): Promise<bigint>;
    addToCart(foodItemId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    getActiveSubscription(): Promise<Subscription | null>;
    getAllFoodItems(): Promise<Array<FoodItem>>;
    getAllSubscriptions(): Promise<Array<Subscription>>;
    getCallerUserProfile(): Promise<UserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart>;
    getFoodItem(id: bigint): Promise<FoodItem>;
    getOrder(id: bigint): Promise<OrderType>;
    getOrderHistory(): Promise<Array<OrderType>>;
    getUserProfile(user: Principal): Promise<UserProfile>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(deliveryAddress: string, distanceInKm: number): Promise<bigint>;
    removeFromCart(foodItemId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    subscribeToPlan(plan: SubscriptionPlan, startDate: Time, endDate: Time): Promise<bigint>;
    updateCartItemQuantity(foodItemId: bigint, quantity: bigint): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
}
