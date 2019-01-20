export default class Order {
  id_order: Number;
  date_add: Date;
  customer_name: String;
  delivery_address: String;
  country: String;
  products: [String];
  status: Number;
}