/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
// Utils
import { convertMinutesToFormattedTime } from 'Modules/calendar/utils/index.js'

// Models
import Model from 'Models/index'
import BookedItem from 'Models/booking/bookedItem'
import ExtSystemBookedResource from 'Models/booking/extSystemBookedResource'

// Constants
import { MINUTES_OF_24H } from 'Constant'

export default class BookedResource extends Model {
	bookingId = 0
	startTime = ''
	bookedItems = []
	resourceId = null
	isNextDay = false
	resourceName = null
	bookedResourceId = 0
	estimatedTime = null
	bookingResourceSetupId = 0
	extSystemBookedResource = null

	#isNew = false
	#defaultEstimatedTime = 0

	setIsNew(isNew) {
		this.#isNew = isNew
	}

	setDefaultEstimatedTime(estimatedTime) {
	  this.#defaultEstimatedTime = estimatedTime
	}

	getDefaultEstimatedTime() {
	  return this.#defaultEstimatedTime
	}

	get startTimeInMinutes() {
		return BookedResource.getStartTimeInMinutes({
			startTime: this.startTime,
			isNextDay: this.isNextDay,
		})
	}

	set startTimeInMinutes(minutes = 0) {
		this.isNextDay = !!Math.floor(minutes / MINUTES_OF_24H)
		this.startTime = convertMinutesToFormattedTime(minutes)
	}

	static getStartTimeInMinutes({ startTime, isNextDay }) {
		const [hours, minutes] = startTime.split(':')
		return Number(hours) * 60 + Number(minutes) + Number(isNextDay) * MINUTES_OF_24H
	}

	get createApiFields() {
	  const payload = {}

		payload.isNextDay = this.isNextDay
	  payload.startTime = this.startTime
		payload.estimatedTime = this.estimatedTime
		payload.bookingResourceSetupId = this.bookingResourceSetupId

		payload.bookedItems = this.bookedItems.map(bookedItem => bookedItem.createApiFields)

	  return payload
	}

	get updateApiFields() {
	  const payload = {}

		payload.isNextDay = this.isNextDay
	  payload.startTime = this.startTime
		payload.estimatedTime = this.estimatedTime
		payload.bookingResourceSetupId = this.bookingResourceSetupId

		if (!this.#isNew) {
			payload.bookedResourceId = this.bookedResourceId
		}

		payload.bookedItems = this.bookedItems.map(bookedItem => bookedItem.updateApiFields)

	  return payload
	}

	/**
	 * @override
	 */
	copy(model = new BookedResource()) {
	  super.copy.call(this, model)

	  // Copy private fields
	  this.#defaultEstimatedTime = model.getDefaultEstimatedTime()
	  this.#isNew = model.#isNew

	  return this
	}

	/**
   * @override
   */
	static fields = [
	  ['bookingId', 'bookingId'],
	  ['startTime', 'startTime'],
	  ['isNextDay', 'isNextDay'],
	  ['resourceId', 'resourceId'],
	  ['bookedItems', 'bookedItems', {
	    default: [],
	    build(bookedItems) {
				if (!bookedItems) return []

	      return bookedItems.map(bookedItem => {
	        return BookedItem.build(bookedItem)
	      })
	    },
			revert(bookedItems) {
				return bookedItems.map(bookedItem => {
	        return BookedItem.revert(bookedItem)
	      })
			},
	    copy(bookedItems) {
	      return bookedItems.map((bookedItem = new BookedItem()) => {
	        return new BookedItem().copy(bookedItem)
	      })
	    },
	  }],
	  ['resourceName', 'resourceName'],
	  ['estimatedTime', 'estimatedTime'],
	  ['bookedResourceId', 'bookedResourceId'],
	  ['bookingResourceSetupId', 'bookingResourceSetupId'],
	  ['extSystemBookedResource', 'extSystemBookedResource', {
			default: null,
			build(extSystemBookedResource) {
				if (!extSystemBookedResource) return null

				return ExtSystemBookedResource.build(extSystemBookedResource)
			},
			revert(extSystemBookedResource) {
				if (!extSystemBookedResource) return null

				return ExtSystemBookedResource.revert(extSystemBookedResource)
			},
		}],
	]

	get bookedItemsEstimatedTime() {
	  const totalEstimatedTime = this.bookedItems.reduce((totalEstimatedTime, bookedItem = new BookedItem()) => {
	    return totalEstimatedTime + bookedItem.getEstimatedTime()
	  }, 0)

	  return Math.max(totalEstimatedTime, this.#defaultEstimatedTime)
	}
}

