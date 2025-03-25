import * as Yup from "yup";

const rules = {
  name: Yup.string().required("Name is a required field"),
  description: Yup.string().required("Description is a required field"),
  categoryId: Yup.number()
    .required("Category is a required field")
    .positive("Category must be a valid category")
    .integer("Category must be an integer"),
  typeId: Yup.number().nullable().optional(),
  price: Yup.number()
    .required("Price is a required field")
    .positive("Price must be a positive number"),
  duration: Yup.number().nullable().optional(),
  durationUnit: Yup.string().nullable().optional(),
};

export const create = Yup.object().shape({
  ...rules,
});

export const update = Yup.object().shape({
  ...rules,
});