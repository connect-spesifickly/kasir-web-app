import * as yup from "yup";

export const createStockAdjustmentSchema = () =>
  yup.object().shape({
    productId: yup.string().required(),
    userId: yup.string().required(),
    quantityChange: yup
      .number()
      .required()
      .notOneOf([0], "Quantity change cannot be zero"),
    reason: yup.string().required(),
  });
