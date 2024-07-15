/**
 * Example: of config for FITB
 *
 *
 * @example
 * Based on this config and value picked in labelType you should have the following FITB in UI:
 *
 *  labelType = 'no-label'
 *      Please enter the widget name: [INPUT: 'name'], now pick the display label type: [SELECT: 'labelType']. After you configure the widget, we are ready for displaying it in your workspace.
 *
 *  labelType = 'currency'
 *      Please enter the widget name: [INPUT: 'name'], now pick the display label type: [SELECT: 'labelType'] Pick currency: [SELECT: 'labelCurrency']. After you configure the widget, we are ready for displaying it in your workspace.
 *
 *  labelType = 'custom-label'
 *      Please enter the widget name: [INPUT: 'name'], now pick the display label type: [SELECT: 'labelType'] Label text prefix: [INPUT: 'labelTextPrefix'] Label text suffix: [INPUT: 'labelTextSuffix']. After you configure the widget, we are ready for displaying it in your workspace.
 */
const widgetDisplayOptions = {
  formData: {
    name: {
      placeholder: "Widget name",
      default: null,
      type: "input"
    },
    labelType: {
      placeholder: "Label type",
      default: "no-label",
      type: "select-with-options",
      options: [
        { name: "Simple", value: "no-label" },
        { name: "Currency", value: "currency" },
        { name: "Custom label", value: "custom-label" }
      ],
    },
    labelCurrency: {
      placeholder: "Label currency",
      default: null,
      type: "select-with-options",
      options: [
        { name: "USD", value: "usd" },
        { name: "EURO", value: "euro" },
        { name: "Pound", value: "pound" }
      ],
    },
    labelTextPrefix: {
      placeholder: "Prefix",
      default: null,
      type: "input"
    },
    labelTextSuffix: {
      placeholder: "Suffix",
      default: null,
      type: "input"
    },
  },
  formDataFillInTheBlanks: {
    data: [
      {
        type: "text",
        data: "Please enter the widget name:"
      },
      {
        type: "fieldControl",
        formDataPointer: "name",
        validators: [{ type: "required" }],
      },
      {
        type: "text",
        data: ", now pick the display label type:"
      },
      {
        type: "fieldControl",
        formDataPointer: "labelType",
        validators: [{ type: "required" }],
        nodes: [
          {
            filter: {
              $in: ['currency']
            },
            children: [
              {
                type: "text",
                data: "Pick currency:",
              },
              {
                type: "fieldControl",
                formDataPointer: "labelCurrency",
                validators: [{ type: "required" }],
              },
            ]
          },
          {
            filter: {
              $in: ['custom-label']
            },
            children: [
              {
                type: "text",
                data: "Label text prefix:",
              },
              {
                type: "fieldControl",
                formDataPointer: "labelTextPrefix",
                validators: [],
              },
              {
                type: "text",
                data: "Label text suffix:",
              },
              {
                type: "fieldControl",
                formDataPointer: "labelTextSuffix",
                validators: [],
              },
            ]
          }
        ],
      },
      {
        type: "text",
        data: ". After you configure the widget, we are ready for displaying it in your workspace."
      },
    ]
  }
}
