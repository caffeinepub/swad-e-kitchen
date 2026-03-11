import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Food item types
  type FoodItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageUrl : Text;
    rating : Float;
  };

  module FoodItem {
    public func compare(foodItem1 : FoodItem, foodItem2 : FoodItem) : Order.Order {
      Nat.compare(foodItem1.id, foodItem2.id);
    };
  };

  type CartItem = {
    foodItem : FoodItem;
    quantity : Nat;
  };

  module CartItem {
    public func compare(cartItem1 : CartItem, cartItem2 : CartItem) : Order.Order {
      FoodItem.compare(cartItem1.foodItem, cartItem2.foodItem);
    };
  };

  type Cart = {
    items : [CartItem];
  };

  type OrderStatus = {
    #orderPlaced;
    #preparing;
    #outForDelivery;
    #delivered;
  };

  type OrderType = {
    id : Nat;
    userId : Principal;
    items : [CartItem];
    deliveryAddress : Text;
    distanceInKm : Float;
    totalAmount : Float;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  type SubscriptionPlan = {
    #weeklyLunch;
    #weeklyDinner;
    #weeklyCombo;
    #monthlyLunch;
    #monthlyDinner;
    #monthlyCombo;
  };

  type Subscription = {
    id : Nat;
    userId : Principal;
    plan : SubscriptionPlan;
    isActive : Bool;
    startDate : Time.Time;
    endDate : Time.Time;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    savedAddresses : [Text];
  };

  // Persistent storage
  let foodItems = Map.empty<Nat, FoodItem>();
  let carts = Map.empty<Principal, Cart>();
  let orders = Map.empty<Nat, OrderType>();
  let subscriptions = Map.empty<Nat, Subscription>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var foodItemIdCounter = 0;
  var orderIdCounter = 0;
  var subscriptionIdCounter = 0;

  // Food item management (admin only)
  public shared ({ caller }) func addFoodItem(name : Text, description : Text, price : Float, category : Text, imageUrl : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add food items");
    };

    let id = foodItemIdCounter;
    let foodItem : FoodItem = {
      id;
      name;
      description;
      price;
      category;
      imageUrl;
      rating = 0.0;
    };
    foodItems.add(id, foodItem);
    foodItemIdCounter += 1;
    id;
  };

  public query ({ caller }) func getFoodItem(id : Nat) : async FoodItem {
    switch (foodItems.get(id)) {
      case (null) { Runtime.trap("Food item does not exist") };
      case (?foodItem) { foodItem };
    };
  };

  public query ({ caller }) func getAllFoodItems() : async [FoodItem] {
    foodItems.values().toArray();
  };

  // Cart management
  public shared ({ caller }) func addToCart(foodItemId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    switch (foodItems.get(foodItemId)) {
      case (null) { Runtime.trap("Food item does not exist") };
      case (?foodItem) {
        let cart = switch (carts.get(caller)) {
          case (null) { { items = [] } };
          case (?c) { c };
        };

        let updated = cart.items.map(
          func(item) {
            if (item.foodItem.id == foodItemId) {
              { foodItem = item.foodItem; quantity = item.quantity + quantity };
            } else {
              item;
            };
          }
        );

        let newItem = { foodItem; quantity };
        let items = if (cart.items.filter(func(item) { item.foodItem.id == foodItemId }).size() > 0) {
          updated;
        } else {
          cart.items.concat([newItem]);
        };

        let newCart : Cart = { items };
        carts.add(caller, newCart);
      };
    };
  };

  public shared ({ caller }) func removeFromCart(foodItemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart does not exist") };
      case (?cart) {
        let filtered = cart.items.filter(
          func(item) { item.foodItem.id != foodItemId }
        );
        let newCart : Cart = { items = filtered };
        carts.add(caller, newCart);
      };
    };
  };

  public shared ({ caller }) func updateCartItemQuantity(foodItemId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart does not exist") };
      case (?cart) {
        let updated = cart.items.map(
          func(item) {
            if (item.foodItem.id == foodItemId) {
              { foodItem = item.foodItem; quantity };
            } else {
              item;
            };
          }
        );
        let newCart : Cart = { items = updated };
        carts.add(caller, newCart);
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

    carts.remove(caller);
  };

  public query ({ caller }) func getCart() : async Cart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access cart");
    };

    switch (carts.get(caller)) {
      case (null) { { items = [] } };
      case (?cart) { cart };
    };
  };

  // Orders
  public shared ({ caller }) func placeOrder(deliveryAddress : Text, distanceInKm : Float) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart does not exist") };
      case (?c) {
        if (c.items.size() == 0) {
          Runtime.trap("Cart is empty");
        };
        c;
      };
    };

    let totalAmount = cart.items.foldLeft(
      0.0,
      func(acc, item) {
        acc + (item.foodItem.price * item.quantity.toInt().toFloat());
      },
    );

    let deliveryFee = 0.0; // TODO: Integrate delivery fee calculation
    let orderTotal = totalAmount + deliveryFee;

    let id = orderIdCounter;
    let order : OrderType = {
      id;
      userId = caller;
      items = cart.items;
      deliveryAddress;
      distanceInKm;
      totalAmount = orderTotal;
      status = #orderPlaced;
      createdAt = Time.now();
    };

    orders.add(id, order);
    orderIdCounter += 1;

    carts.remove(caller);

    id;
  };

  public query ({ caller }) func getOrder(id : Nat) : async OrderType {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot view someone else's order");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getOrderHistory() : async [OrderType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };

    orders.values().toArray().filter(
      func(order : OrderType) : Bool { order.userId == caller }
    );
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Subscriptions
  public shared ({ caller }) func subscribeToPlan(plan : SubscriptionPlan, startDate : Time.Time, endDate : Time.Time) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can subscribe to plans");
    };

    let id = subscriptionIdCounter;
    let subscription : Subscription = {
      id;
      userId = caller;
      plan;
      isActive = true;
      startDate;
      endDate;
    };

    subscriptions.add(id, subscription);
    subscriptionIdCounter += 1;
    id;
  };

  public query ({ caller }) func getActiveSubscription() : async ?Subscription {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subscriptions");
    };

    subscriptions.values().find(
      func(sub) { sub.userId == caller and sub.isActive }
    );
  };

  public query ({ caller }) func getAllSubscriptions() : async [Subscription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subscriptions");
    };

    subscriptions.values().toArray().filter(
      func(sub : Subscription) : Bool { sub.userId == caller }
    );
  };

  // User profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User profile does not exist") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile does not exist") };
      case (?profile) { profile };
    };
  };
};
