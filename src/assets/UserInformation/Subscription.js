class Subscription {
    constructor(subscriptionId, name, price, startDate, length, description, endDate) {
        this.subscriptionId = subscriptionId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.length = length;
        this.startDate = startDate;
        this.endDate = endDate;
        }

    getSubscriptionId() {
        return this.subscriptionId;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getStartDate() {
        return this.startDate;
    }

    getPrice() {
        return this.price;
    }

    getLength() {
        return this.length;
    }

    getEndDate() {
        return this.endDate;
    }

    setSubscriptionId(subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    setName(name) {
        this.name = name;
    }

    setDescription(description) {
        this.description = description;
    }

    setStartDate(startDate) {
        this.startDate = startDate;
    }

    setPrice(price) {
        this.price = price;
    }

    setLength(length) {
        this.length = length;
    }

    setEndDate(endDate) {
        this.endDate = endDate;
    }

    getSubscriptionInfo() {
        if (this.name === "Free subcription") {
            return "You don't have any subscription yet";
        }
        return "You currently have a " + this.name + " subscription that costs " + this.price + " per month and that will end on " + this.endDate;
    }
}

export default Subscription;