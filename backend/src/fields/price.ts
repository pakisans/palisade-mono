import type { Field } from 'payload'

export const priceFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'price',
        type: 'number',
        label: 'Regular Price (RSD)',
        min: 0,
        required: true,
        admin: {
          step: 1,
          width: '50%',
        },
      },
      {
        name: 'salePrice',
        type: 'number',
        label: 'Sale Price (RSD)',
        min: 0,
        admin: {
          step: 1,
          width: '50%',
        },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'saleStartDate',
        type: 'date',
        admin: {
          condition: (_, siblingData) => Boolean(siblingData?.salePrice),
          date: {
            pickerAppearance: 'dayAndTime',
          },
          width: '50%',
        },
        label: 'Sale Starts',
      },
      {
        name: 'saleEndDate',
        type: 'date',
        admin: {
          condition: (_, siblingData) => Boolean(siblingData?.salePrice),
          date: {
            pickerAppearance: 'dayAndTime',
          },
          width: '50%',
        },
        label: 'Sale Ends',
      },
    ],
  },
]
