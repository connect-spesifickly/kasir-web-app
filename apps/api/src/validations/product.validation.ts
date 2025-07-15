import * as yup from "yup";

export const createProductSchema = () =>
  yup.object().shape({
    productCode: yup.string().required("Product code is required"),
    productName: yup.string().required("Product name is required"),
    costPrice: yup.number().required("Cost price is required").min(0),
    price: yup.number().required("Price is required").min(0),
    stock: yup.number().required("Stock is required").min(0),
    minStock: yup.number().min(1, "Stok minimum harus minimal 1").notRequired(),
  });

export const updateProductSchema = () =>
  yup.object().shape({
    productCode: yup.string(),
    productName: yup.string(),
    price: yup.number().min(0),
  });

export const restockProductSchema = () =>
  yup.object().shape({
    quantityAdded: yup.number().required().min(1),
    newCostPrice: yup.number().required().min(0),
  });
