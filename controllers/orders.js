const Ajv = require("ajv");
const ajv = new Ajv();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Orders, Payments, Products } = require("./exp");

const createOrder = async (req, res) => {
  try {
    const SchemaOrderPlace = {
      type: "object",
      properties: {
        cid: {
          type: "string",
        },
        pid: {
          type: "string",
        },
        pay_type: {
          type: "string",
        },
        pay_status: {
          type: "string",
        },
        colors: {
          type: "array",
        },
        sizes: {
          type: "array",
        },
        quantity: {
          type: "integer",
        },
      },
      required: [
        "cid",
        "pid",
        "pay_type",
        "pay_status",
        "colors",
        "sizes",
        "quantity",
      ],
    };
    const data = req.body;
    const validate = ajv.compile(SchemaOrderPlace);
    const valid = validate(data);
    if (!valid) throw new Error(validate.errors[0].message);
    else {
      let fetchAmount = await Products.findOne(
        { _id: req.body.pid },
        { price: 1, _id: 0 }
      );
      fetchAmount = fetchAmount.price * req.body.quantity;
      const newOrder = {
        pid: data.pid,
        cid: data.cid,
        quantity: data.quantity,
        colors: data.colors,
        sizes: data.sizes,
        amount: fetchAmount,
        total: (fetchAmount * 18) / 100 + fetchAmount,
      };
      const addOrder = new Orders(newOrder);
      const order = await addOrder.save();
      const pay = {
        amount: order.amount,
        pay_type: data.pay_type,
        pay_status: data.pay_status,
        oid: order._id,
        cid: data.cid,
        total: order.total,
      };
      let addPayment = new Payments(pay);
      addPayment = await addPayment.save();
      await Orders.updateOne(
        { _id: order._id },
        { $set: { pay_id: addPayment._id } }
      );
      await Products.updateOne(
        { _id: req.body.pid },
        { $inc: { stock: -req.body.quantity } }
      );
      const showDetails = await Orders.findOne({ _id: order._id })
        .populate("cid")
        .populate("pid")
        .populate("pay_id");
      res.status(200).json(showDetails);
    }
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err);
  }
};

const readOrderOne = async (req, res) => {
  try {
    const id = req.query.id;
    const showDetails = await Orders.findOne({ _id: id })
      .populate("cid")
      .populate("pid")
      .populate("pay_id");
    res.status(200).json(showDetails);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const readOrder = async (req, res) => {
  try {
    const showDetails = await Orders.find();
    res.status(200).json(showDetails);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await Orders.findByIdAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const data = req.params._id;
    const result = await Orders.findByIdAndDelete({ _id: data });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// const aggregatePaymentStatusAndCustomers = async (req, res) => {
//     try {
//         const finalOutput = async () => {
//             let trial = await Payments.distinct("cid")
//             let array = []
//             for (i in trial) {
//                 const id = trial[i]
//                 let result = await Payments.aggregate([
//                     { $match: { cid: id } },
//                     {
//                         $facet: {
//                             Paid: [
//                                 { $match: { pay_status: "Paid" } },
//                                 { $project: { pay_status: 1, total: 1, _id: 0 } }
//                             ],
//                             Unpaid: [
//                                 { $match: { pay_status: "Unpaid" } },
//                                 { $project: { pay_status: 1, total: 1, _id: 0 } }
//                             ]
//                         }
//                     }
//                 ])
//                 // console.log("Result:::::", JSON.stringify(result));
//                 resultOfPaid = result[0].Paid //making an array of object of Pay_status:Paid
//                 resultOfUnpaid = result[0].Unpaid //making an array of object of Pay_status:Unpaid
//                 let paid = 0;
//                 let unpaid = 0;
//                 resultOfPaid.forEach(function (Item) {
//                     paid = paid + Item.total;
//                 });
//                 resultOfUnpaid.forEach(function (Item) {
//                     unpaid = unpaid + Item.total;
//                 });
//                 const status = () => {
//                     if (unpaid === 0) {
//                         return "Paid"
//                     }
//                     else {
//                         return "Unpaid"
//                     }
//                 }
//                 const output = {
//                     CustomerID: id,
//                     Paid: paid,
//                     Unpaid: unpaid,
//                     Total:paid+unpaid,
//                     Status: status()
//                 }
//                 array.push(output)
//             }
//             return array
//         }
//         finalOutput().then((array) => res.status(200).json(array))
//     }
//     catch (err) {
//         res.status(500).json(err.message)
//     }
// }

const aggregatePaymentStatusAndCustomers = async (req, res) => {
  try {
    const result = await Orders.aggregate([
      {
        $lookup: {
          from: "payments",
          localField: "pay_id",
          foreignField: "_id",
          as: "status",
        },
      },
      {
        $lookup: {
          from: "customer_infos",
          localField: "cid",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$status" },
      { $unwind: "$customer" },
      {
        $project: {
          _id: 0,
          "customer.name": 1,
          "status.cid": 1,
          "status.total": 1,
          "status.pay_status": 1,
        },
      },
      {
        $addFields: {
          CustomerID: "$status.cid",
          CustomerName: "$customer.name",
          Amount: "$status.total",
          Status: "$status.pay_status",
        },
      },
      { $project: { status: 0, customer: 0 } },
      {
        $group: {
          _id: {
            CustomerID: "$CustomerID",
            CustomerName: "$CustomerName",
            Status: "$Status",
          },
          Amount: { $sum: "$Amount" },
        },
      },
      {
        $project: {
          _id: 0,
          CustomerID: "$_id.CustomerID",
          CustomerName: "$_id.CustomerName",
          Status: "$_id.Status",
          Amount: 1,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const aggregateBasedOnCustomers = async (req, res) => {
  try {
    const result = await Orders.aggregate([
      {
        $lookup: {
          from: "payments",
          localField: "pay_id",
          foreignField: "_id",
          as: "status",
        },
      },
      {
        $lookup: {
          from: "customer_infos",
          localField: "cid",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$status" },
      { $unwind: "$customer" },
      {
        $project: {
          _id: 0,
          "customer.name": 1,
          "status.cid": 1,
          "status.total": 1,
          "status.pay_status": 1,
        },
      },
      {
        $addFields: {
          CustomerID: "$status.cid",
          CustomerName: "$customer.name",
          Amount: "$status.total",
          Status: "$status.pay_status",
        },
      },
      { $project: { status: 0, customer: 0 } },
      {
        $group: {
          _id: {
            CustomerID: "$CustomerID",
            CustomerName: "$CustomerName",
            Status: "$Status",
          },
          Amount: { $sum: "$Amount" },
        },
      },
      {
        $project: {
          _id: 0,
          CustomerID: "$_id.CustomerID",
          CustomerName: "$_id.CustomerName",
          Status: "$_id.Status",
          Amount: 1,
        },
      },

      {
        $group: {
          _id: { CustomerID: "$CustomerID", CustomerName: "$CustomerName" },
          S_Paid: {
            $push: {
              $cond: [
                { $eq: ["$Status", "Paid"] },
                { Paid: "$Amount" },
                "$$REMOVE",
              ],
            },
          },
          S_Unpaid: {
            $push: {
              $cond: [
                { $eq: ["$Status", "Unpaid"] },
                { Unpaid: "$Amount" },
                "$$REMOVE",
              ],
            },
          },
        },
      },
      {
        $project: {
          isAnyTrueU: { $anyElementTrue: ["$S_Unpaid"] },
          isAnyTrueP: { $anyElementTrue: ["$S_Paid"] },
          _id: 1,
          CustomerID: "$_id.CustomerID",
          CustomerName: "$_id.CustomerName",
          Paid: { $arrayElemAt: ["$S_Paid.Paid", 0] },
          Unpaid: { $arrayElemAt: ["$S_Unpaid.Unpaid", 0] },
        },
      },
      {
        $project: {
          CustomerID: 1,
          CustomerName: 1,
          Paid: 1,
          Unpaid: 1,
          Unpaid: {
            $cond: [{ $eq: ["$isAnyTrueU", false] }, 0, { Unpaid: "$Unpaid" }],
          },
          Paid: {
            $cond: [{ $eq: ["$isAnyTrueP", false] }, 0, { Paid: "$Paid" }],
          },
        },
      },
      {
        $project: {
          CustomerID: 1,
          CustomerName: 1,
          Paid: { $cond: [{ $eq: ["$Paid", 0] }, 0, "$Paid.Paid"] },
          Unpaid: { $cond: [{ $eq: ["$Unpaid", 0] }, 0, "$Unpaid.Unpaid"] },
          _id: 0,
        },
      },
      {
        $project: {
          CustomerID: 1,
          CustomerName: 1,
          Paid: 1,
          Unpaid: 1,
          Total: { $sum: ["$Paid", "$Unpaid"] },
          Status: { $cond: [{ $eq: ["$Unpaid", 0] }, "Paid", "Unpaid"] },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const aggregateBasedOnCustomersTwo = async (req, res) => {
  try {
    const result = await Orders.aggregate([
      {
        $lookup: {
          from: "payments",
          localField: "pay_id",
          foreignField: "_id",
          as: "status",
        },
      },
      {
        $lookup: {
          from: "customer_infos",
          localField: "cid",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$status" },
      { $unwind: "$customer" },
      {
        $project: {
          _id: 0,
          "customer.name": 1,
          "status.cid": 1,
          "status.total": 1,
          "status.pay_status": 1,
        },
      },
      {
        $addFields: {
          CustomerID: "$status.cid",
          CustomerName: "$customer.name",
          Amount: "$status.total",
          Status: "$status.pay_status",
        },
      },
      { $project: { status: 0, customer: 0 } },
      {
        $group: {
          _id: {
            CustomerID: "$CustomerID",
            CustomerName: "$CustomerName",
            Status: "$Status",
          },
          Amount: { $sum: "$Amount" },
        },
      },
      {
        $project: {
          _id: 0,
          CustomerID: "$_id.CustomerID",
          CustomerName: "$_id.CustomerName",
          Status: "$_id.Status",
          Amount: 1,
        },
      },

      {
        $group: {
          _id: { CustomerID: "$CustomerID", CustomerName: "$CustomerName" },
          S_Paid: {
            $push: {
              $cond: [
                { $eq: ["$Status", "Paid"] },
                { Paid: "$Amount" },
                "$$REMOVE",
              ],
            },
          },
          S_Unpaid: {
            $push: {
              $cond: [
                { $eq: ["$Status", "Unpaid"] },
                { Unpaid: "$Amount" },
                "$$REMOVE",
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          CustomerID: "$_id.CustomerID",
          CustomerName: "$_id.CustomerName",
          Paid: {
            $cond: [
              { $anyElementTrue: ["$S_Paid"] },
              { $arrayElemAt: ["$S_Paid.Paid", 0] },
              0,
            ],
          },
          Unpaid: {
            $cond: [
              { $anyElementTrue: ["$S_Unpaid"] },
              { $arrayElemAt: ["$S_Unpaid.Unpaid", 0] },
              0,
            ],
          },
        },
      },
      {
        $project: {
          CustomerID: 1,
          CustomerName: 1,
          Paid: 1,
          Unpaid: 1,
          Total: { $sum: ["$Paid", "$Unpaid"] },
          Status: { $cond: [{ $eq: ["$Unpaid", 0] }, "Paid", "Unpaid"] },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const lastEntryOfCustomersInOrderTable = async (req, res) => {
  try {
    const result = await Orders.aggregate([
      { $group: { _id: { cid: "$cid" }, Data: { $last: "$$ROOT" } } },
      {
        $project: {
          OrderID: "$Data._id",
          Pid: "$Data.pid",
          Cid: "$Data.cid",
          OrderDateTime: "$Data.o_date_time",
          DeliveryStatus: "$Data.delivery_status",
          Quantity: "$Data.quantity",
          Colors: "$Data.colors",
          Sizes: "$Data.sizes",
          Amount: "$Data.amount",
          Total: "$Data.total",
          Tax: "$Data.tax",
          CreatedAt: "$Data.createdAt",
          UpdatedAt: "$Data.updatedAt",
          PayId: "$Data.pay_id",
          _id: 0,
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "PayId",
          foreignField: "_id",
          as: "pay",
        },
      },
      {
        $project: {
          OrderID: 1,
          Pid: 1,
          Cid: 1,
          OrderDateTime: 1,
          DeliveryStatus: 1,
          Quantity: 1,
          Colors: 1,
          Sizes: 1,
          Amount: 1,
          Total: 1,
          Tax: 1,
          CreatedAt: 1,
          UpdatedAt: 1,
          PayId: 1,
          PayType: "$pay.pay_type",
          PayStatus: "$pay.pay_status",
          PayDateTime: "$pay.pay_date_time",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
module.exports = {
  createOrder,
  readOrderOne,
  readOrder,
  updateOrder,
  deleteOrder,
  aggregatePaymentStatusAndCustomers,
  aggregateBasedOnCustomers,
  lastEntryOfCustomersInOrderTable,
  aggregateBasedOnCustomersTwo,
};
