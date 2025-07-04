import * as yup from "yup";

export const createSaleSchema = () =>
  yup.object().shape({
    cart: yup
      .array()
      .of(
        yup.object().shape({
          productId: yup.string().required(),
          quantity: yup.number().required().min(1),
        })
      )
      .required()
      .min(1),
  });

export const updateSaleSchema = () =>
  yup.object().shape({
    cart: yup
      .array()
      .of(
        yup.object().shape({
          productId: yup.string().required(),
          quantity: yup.number().required().min(1),
        })
      )
      .required()
      .min(1),
  });

export const deleteSaleSchema = () =>
  yup.object().shape({
    id: yup.string().required(),
  });
