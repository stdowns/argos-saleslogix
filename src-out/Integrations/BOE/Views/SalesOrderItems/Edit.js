define('crm/Integrations/BOE/Views/SalesOrderItems/Edit', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', 'argos/Utility', 'argos/Edit', 'argos/I18n', '../../PricingAvailabilityService', 'crm/Validator', '../../Models/Names', 'argos/Models/Types'], function (module, exports, _declare, _lang, _string, _Utility, _Edit, _I18n, _PricingAvailabilityService, _Validator, _Names, _Types) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _string2 = _interopRequireDefault(_string);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _Edit2 = _interopRequireDefault(_Edit);

  var _I18n2 = _interopRequireDefault(_I18n);

  var _PricingAvailabilityService2 = _interopRequireDefault(_PricingAvailabilityService);

  var _Validator2 = _interopRequireDefault(_Validator);

  var _Names2 = _interopRequireDefault(_Names);

  var _Types2 = _interopRequireDefault(_Types);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /* Copyright 2017 Infor
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *    http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var resource = (0, _I18n2.default)('salesOrderItemEdit');

  /**
   * @class crm.Views.QuoteLines.Edit
   *
   * @extends argos.Edit
   *
   * @requires argos.Edit
   *
   */
  var __class = (0, _declare2.default)('crm.Integrations.BOE.Views.SalesOrderItems.Edit', [_Edit2.default], {
    // View Properties
    id: 'salesorder_item_edit',
    detailView: 'salesorder_item_detail',
    insertSecurity: 'Entities/SalesOrder/Add',
    updateSecurity: 'Entities/SalesOrder/Edit',
    resourceKind: 'salesOrderItems',
    titleText: resource.titleText,
    productText: resource.productText,
    quantityText: resource.quantityText,
    orderText: resource.orderText,
    priceText: resource.priceText,
    baseAdjustedPriceText: resource.baseAdjustedPriceText,
    docAdjustedPriceText: resource.docAdjustedPriceText,
    baseExtendedPriceText: resource.baseExtendedPriceText,
    docExtendedPriceText: resource.docExtendedPriceText,
    unitOfMeasureText: resource.unitOfMeasureText,
    unitsOfMeasureTitle: resource.unitsOfMeasureTitle,
    docTotalAmountText: resource.docTotalAmountText,
    lineText: resource.lineText,
    warehouseText: resource.warehouseText,
    accountLinked: false,

    init: function init() {
      this.inherited(init, arguments);
      this.fields.ErpLineNumber.disable();
      if (App.warehouseDiscovery === 'auto') {
        this.fields.SlxLocation.disable();
      }

      this.fields.SalesOrder.disable();
      this.fields.Price.disable();
      this.fields.ExtendedPrice.disable();
      this.fields.DocExtendedPrice.disable();
      this.fields.CalculatedPrice.disable();
      this.fields.DocCalculatedPrice.disable();
      this.fields.DocTotalAmount.disable();
      this.connect(this.fields.Product, 'onChange', this.onProductChange);
      this.connect(this.fields.Quantity, 'onChange', this.onQuantityChange);
    },
    _applyLogicValues: function _applyLogicValues(values) {
      var product = this.fields.Product.getSelection();
      values.ProductName = product.Name;
      values.Family = product.Family;
      values.ActualID = product.ActualId;
      values.CommodityType = product.CommodityType;
    },
    applyContext: function applyContext() {
      this.inherited(applyContext, arguments);
      if (this.options && this.options.context) {
        if (this.options.context.SalesOrder) {
          this.fields.SalesOrder.setSelection(this.options.context.SalesOrder);
          this.fields.SalesOrder.disable();
          if (this.options.context.SalesOrder.Account) {
            this.accountLinked = this.options.context.SalesOrder.Account.ErpExtId === true;
          }
        } else {
          this.fields.SalesOrder.enable();
        }
      }
      this.setProductDependentFields();
    },
    setProductDependentFields: function setProductDependentFields(product) {
      var _this = this;

      var dependants = this.getProductDependants();
      if (product) {
        dependants.forEach(function (f) {
          _this.fields[f].enable();
          _this.fields[f].dependsOn = 'Product';
          _this.fields[f].where = 'Product.Id eq "' + product.$key + '"';
        });
      } else {
        dependants.forEach(function (f) {
          _this.fields[f].disable();
          _this.fields[f].dependsOn = null;
          _this.fields[f].where = null;
        });
      }
    },
    getProductDependants: function getProductDependants() {
      return ['UnitOfMeasure'];
    },
    onInsert: function onInsert(values) {
      this._applyLogicValues(values);
      this.inherited(onInsert, arguments);
    },
    onRefresh: function onRefresh() {
      this.inherited(onRefresh, arguments);
      this.setProductDependentFields();
    },
    processEntry: function processEntry(entry) {
      this.setProductDependentFields(entry.Product);
      return entry;
    },
    requestProductPricing: function requestProductPricing(product, quantity, slxLocation, unitOfMeasure) {
      var _this2 = this;

      var salesOrder = null;
      if (this.options && this.options.context && this.options.context.SalesOrder) {
        salesOrder = this.options.context.SalesOrder;
      } else {
        if (this.fields.SalesOrder) {
          salesOrder = this.fields.SalesOrder.getValue();
        }
      }
      if (salesOrder && salesOrder.$key && !this.isProcessingPricingRequest) {
        this.isProcessingPricingRequest = true;
        this.enablePricingControls(false);
        _PricingAvailabilityService2.default.getOrderItemPricing(this.entry, salesOrder, product, quantity, slxLocation, unitOfMeasure).then(function (results) {
          _this2.onProductPricingSuccess(results);
        }, function (error) {
          _this2.onProductPricingFailed(error);
        });
      }
    },
    onProductPricingSuccess: function onProductPricingSuccess(result) {
      var _this3 = this;

      this.processProductPricing(result).then(function () {
        _this3.reCalculate();
        _this3.isProcessingPricingRequest = false;
        _this3.enablePricingControls(true);
      }, function () {
        _this3.isProcessingPricingRequest = false;
        _this3.enablePricingControls(true);
      });
    },
    onProductPricingFailed: function onProductPricingFailed(result) {
      this.isProcessingPricingRequest = false;
      this.enablePricingControls(true);
      this.App.modal.createSimpleDialog({
        title: 'alert',
        content: result.Results
      });
    },
    setUomFromCode: function setUomFromCode(uomCode) {
      var _this4 = this;

      var curremtUom = this.fields.UnitOfMeasure.getValue();
      var product = this.fields.Product.getValue();
      var promise = new Promise(function (resolve, reject) {
        if (!_this4._uomModel) {
          _this4._uomModel = App.ModelManager.getModel(_Names2.default.UNITOFMEASURE, _Types2.default.SDATA);
        }
        if (_this4._uomModel && product) {
          if (curremtUom && curremtUom.Name !== uomCode || !curremtUom) {
            _this4._uomModel.getUnitOfMeasureFromCode(uomCode, product.$key).then(function (uom) {
              _this4.fields.UnitOfMeasure.setValue(uom);
              resolve(true);
            }, function (error) {
              reject(error);
            });
          } else {
            resolve(true);
          }
        } else {
          resolve(true);
        }
      });
      return promise;
    },
    processProductPricing: function processProductPricing(pricingData) {
      var _this5 = this;

      var promise = new Promise(function (resolve, reject) {
        if (pricingData) {
          if (pricingData.DocCalculatedPrice) {
            _this5.fields.DocCalculatedPrice.setValue(pricingData.DocCalculatedPrice.value);
          }
          if (pricingData.DocExtendedPrice) {
            _this5.fields.DocExtendedPrice.setValue(pricingData.DocExtendedPrice.value);
          }
          if (pricingData.DocTotalAmount) {
            _this5.fields.DocTotalAmount.setValue(pricingData.DocTotalAmount.value);
          }
          if (pricingData.SlxLocationId) {
            _this5.fields.SlxLocation.setValue({
              $key: pricingData.SlxLocationId.value,
              Name: pricingData.SlxLocationCode.value
            });
          }
          if (pricingData.UnitOfMeasure) {
            _this5.setUomFromCode(pricingData.UnitOfMeasure.value).then(function () {
              resolve(true);
            }, function (error) {
              reject(error);
            });
          } else {
            resolve(true);
          }
        } else {
          resolve(true);
        }
      });
      return promise;
    },
    onProductChange: function onProductChange(value, field) {
      this.setProductDependentFields(field.currentSelection);
      this.fields.ProductName.setValue(value.text);
      this.fields.SlxLocation.setValue(null);
      this.requestProductPricing(field.currentSelection, this.fields.Quantity.getValue(), this.fields.SlxLocation.getValue(), this.fields.UnitOfMeasure.getValue());
    },
    onQuantityChange: function onQuantityChange(value) {
      if (isNaN(value)) {
        this.fields.Quantity.setValueNoTrigger(0);
      }
      if (this.isAdHocProduct(this.fields.Product.getValue())) {
        this.reCalculate();
      } else {
        this.requestProductPricing(this.fields.Product.getValue(), this.fields.Quantity.getValue(), this.fields.SlxLocation.getValue(), this.fields.UnitOfMeasure.getValue());
      }
    },
    enablePricingControls: function enablePricingControls(enable) {
      if (enable) {
        // To-do make this more dynamic.
        this.fields.Product.enable();
        this.fields.Quantity.enable();
        this.fields.SlxLocation.enable();
        this.fields.UnitOfMeasure.enable();
      } else {
        this.fields.Product.disable();
        this.fields.Quantity.disable();
        this.fields.SlxLocation.disable();
        this.fields.UnitOfMeasure.disable();
      }
    },
    isAdHocProduct: function isAdHocProduct(product) {
      if (product.LineType === 'FreeText') {
        return true;
      }
      return false;
    },
    reCalculate: function reCalculate() {
      var price = this.fields.CalculatedPrice.getValue();
      var quantity = this.fields.Quantity.getValue();
      this.fields.ExtendedPrice.setValue(quantity * price);
    },
    formatDependentQuery: function formatDependentQuery(dependentValue, theFormat, property) {
      return _string2.default.substitute(theFormat, [_Utility2.default.getValue(dependentValue, property || '$key')]);
    },
    onUpdateCompleted: function onUpdateCompleted() {
      this._refreshRelatedViews();
      this.inherited(onUpdateCompleted, arguments);
    },
    onInsertCompleted: function onInsertCompleted() {
      this._refreshRelatedViews();
      this.inherited(onInsertCompleted, arguments);
    },
    _refreshRelatedViews: function _refreshRelatedViews() {
      var views = [App.getView('salesorder_item_detail'), App.getView('salesorder_items_list')];

      views.forEach(function (view) {
        if (view) {
          view.refreshRequired = true;
        }
      });
    },
    createLayout: function createLayout() {
      var _this6 = this;

      return this.layout || (this.layout = [{
        title: this.detailsText,
        name: 'DetailsSection',
        children: [{
          label: this.lineText,
          name: 'ErpLineNumber',
          property: 'ErpLineNumber',
          type: 'text'
        }, {
          label: this.orderText,
          name: 'SalesOrder',
          property: 'SalesOrder',
          type: 'lookup',
          emptyText: '',
          valueTextProperty: 'SalesOrderNumber',
          view: 'orderitem_salesorder_list'
        }, {
          label: this.productText,
          name: 'Product',
          property: 'Product',
          type: 'lookup',
          emptyText: '',
          valueTextProperty: 'Name',
          view: 'salesorder_product_related',
          autoFocus: true,
          required: true,
          where: function where() {
            if (_this6.fields.SalesOrder.currentSelection && _this6.fields.SalesOrder.currentSelection.ErpLogicalId || _this6.options && _this6.options.context && _this6.options.context.SalesOrder && _this6.options.context.SalesOrder.ErpLogicalId) {
              return 'ErpLogicalId eq "' + (_this6.fields.SalesOrder.currentSelection.ErpLogicalId || _this6.options.context.SalesOrder.ErpLogicalId) + '"';
            }
            return null;
          }
        }, {
          name: 'ProductName',
          property: 'ProductName',
          type: 'hidden'
        }, {
          label: this.quantityText,
          name: 'Quantity',
          property: 'Quantity',
          type: 'decimal',
          default: 1,
          notificationTrigger: 'blur',
          validator: _Validator2.default.exists
        }, {
          label: this.unitOfMeasureText,
          name: 'UnitOfMeasure',
          property: 'UnitOfMeasure',
          type: 'lookup',
          emptyText: '',
          valueTextProperty: 'Name',
          view: 'orderitem_unitofmeasure_list',
          title: this.unitsOfMeasureTitle
        }, {
          name: 'SlxLocation',
          property: 'SlxLocation',
          label: this.warehouseText,
          type: 'lookup',
          view: 'locations_list',
          textProperty: 'Description',
          valueTextProperty: 'Name'
        }, {
          label: this.priceText,
          name: 'Price',
          property: 'Price',
          type: 'decimal',
          default: 0.00
        }, {
          label: this.baseAdjustedPriceText,
          name: 'CalculatedPrice',
          property: 'CalculatedPrice',
          type: 'decimal',
          default: 0.00
        }, {
          label: this.docAdjustedPriceText,
          name: 'DocCalculatedPrice',
          property: 'DocCalculatedPrice',
          type: 'decimal',
          default: 0.00
        }, {
          label: this.baseExtendedPriceText,
          name: 'ExtendedPrice',
          property: 'ExtendedPrice',
          type: 'decimal',
          default: 0.00
        }, {
          label: this.docExtendedPriceText,
          name: 'DocExtendedPrice',
          property: 'DocExtendedPrice',
          type: 'decimal',
          default: 0.00
        }, {
          label: this.docTotalAmountText,
          name: 'DocTotalAmount',
          property: 'DocTotalAmount',
          type: 'decimal',
          default: 0.00
        }] }]);
    }
  });

  _lang2.default.setObject('icboe.Views.SalesOrderItems.Edit', __class);
  exports.default = __class;
  module.exports = exports['default'];
});