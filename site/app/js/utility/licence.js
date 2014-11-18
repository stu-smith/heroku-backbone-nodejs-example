define([], function () {
	
	'use strict';

	return {

		paymentOptions: [
			{
				key: 'one-year',
				description: 'One Year',
				months: 12,
				prices: {
					USD: { amount: 10, display: '$10' }
				}
			},
			{
				key: 'two-year',
				description: 'Two Years',
				months: 24,
				prices: {
					USD: { amount: 15, display: '$15' }
				}
			}
		]

	};

});
