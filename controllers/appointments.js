const { Appiontment, Slot } = Model;
const Nexmo = require("nexmo");

const appointmentController = {
	all(req, res) {
		Appointment.find({}).exec((err, appointments) =>
			res.json(appointments));
	},
	create(req, res) {
		var requestBody = req.body;

		var newslot = new Slot({
			slot_time: requestBody.slot_time,
			slot_date: requestBody.slot_date,
			created_at: Date.now()
		});
		newslot.save();

		// create a new record from a submitted form
		var newappointment = new Appointment({
			name: requestBody.name,
			email: requestBody.email,
			phone: requestBody.phone,
			slots: newslot._id
		});

		const nexmo = new Nexmo({
			apiKey: "9b1c49a3"
			apiSecret: "I5XnlkaonHQCINHx" 
		});

		let msg =
			requestBody.name + " " + "appointment confirmed" + 
			" " + requestBody.appointment;

		newappointment.save((err, saved) => {
			Appointment.find({ _id: saved._id })
			.populate("slots").exec((err, appointment) => res.json(appointment));

			const from = VIRTUAL_NUMBER;
			const to = RECIPIENT_NUMBER;

			nexmo.message.sendSms(from, to, msg, (err, responseData) => {
				if (err) {
					console.log(err);
				} else {
					console.dir(responseData);
				}
			});
		}); 
	}
};

module.exports = appointmentController;
