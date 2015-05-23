(function () {
    'use strict'

    document.addEventListener('DOMContentLoaded', function () {

        function Bids() {
            /**
             * Bid storage with predefined categories.
             *
             * @type {{sales: Array, purchases: Array}}
             */
            this.data = {
                sales: [],
                purchases: []
            };
            /**
             * Array of bid categories in needed order for output.
             *
             * @type {string[]}
             */
            this.categoriesOrder = []
            /**
             * DOM Element to place filled template (will be empty!).
             *
             * @type {HTMLElement}
             */
            this.domContainer = '';
        }

        /**
         * Returns object with pseudo-random bid in specified limits.
         *
         * @static method
         * @returns {{name: (string|*), price: (number|*), volume: (number|*)}}
         */
        Bids.getRandomBid = function () {
            var price = {min: 1000, max: 10000};
            var volume = {min: 1, max: 1000};

            return {
                name: (_.sample(_.map(_.range(1072, 1103), String.fromCharCode), 10)).join(''),
                price: _.random(price.min, price.max),
                volume: _.random(volume.min, volume.max)
            }
        }

        /**
         * Add bid with specified category to storage.
         *
         * @param bid - Bid to be added.
         * @param category - Category of bid.
         */
        Bids.prototype.add = function (bid, category) {
            var list = this.data[category];
            list.splice(_.sortedIndex(list, bid, 'price', this), 0, bid);

            this.sort();
            this.updateDomContainer();
        }

        /**
         * Sort bids in each category of storage.
         */
        Bids.prototype.sort = function () {
            _.each(this.categoriesOrder, function (currentCategory) {
                this.data[currentCategory] = (_.sortBy(this.data[currentCategory], 'price')).reverse();
            }, this);
        }

        /**
         * Assign bids to specified DOM Element.
         */
        Bids.prototype.updateDomContainer = function () {
            var rows = '';

            _.each(this.categoriesOrder, function (currentCategory) {
                _.each(this.data[currentCategory], function (currentBid) {
                    rows += _.template(
                        '<tr data-category="<%= data.category %>">' +
                        '<td data-field="name"><%= data.name %></td>' +
                        '<td data-field="sale-volume"><%= data.sale %></td>' +
                        '<td data-field="price"><%= data.price %></td>' +
                        '<td data-field="purchase-volume"><%= data.purchase %></td>' +
                        '</tr>',
                        {variable: 'data'}
                    )({
                        category: currentCategory,
                        name: currentBid.name,
                        sale: (currentCategory == this.categoriesOrder[0] ? formatNumber(currentBid.volume) : ''),
                        price: formatNumber(currentBid.price),
                        purchase: (currentCategory == this.categoriesOrder[1] ? formatNumber(currentBid.volume) : '')
                    });
                }, this);
            }, this);

            this.domContainer.innerHTML = rows;
        }

        /**
         * Format number with specified or default precision and delimiters.
         *
         * @param number: number
         * @param precision: integer, optional. Default: 2
         * @param fractionDelimiter: string, optional. Default: '.'
         * @param thousandsDelimiter: string, optional. Default: ','
         * @returns string
         */
        function formatNumber(number, precision, fractionDelimiter, thousandsDelimiter) {
            if (Number.isNaN(+number)) {
                return '';
            }

            var precision = precision || 2;
            var fractionDelimiter = fractionDelimiter || '.';
            var thousandsDelimiter = thousandsDelimiter || ',';

            var thousandsDelimiterRE = /(-?)(\d{1,3})(?=(\d{3})+(?!\d))/g;

            var numberByParts = (+number).toFixed(precision).split('.', 2);
            var formattedNumber = numberByParts[0].replace(thousandsDelimiterRE, '$&' + thousandsDelimiter);
            formattedNumber += fractionDelimiter + numberByParts[1];

            return formattedNumber;
        }


        var bids = new Bids();
        bids.categoriesOrder = ['sales', 'purchases'];
        bids.domContainer = document.getElementsByTagName('tbody')[0];

        document.getElementsByClassName('add-sale')[0].addEventListener('click', function () {
            bids.add(Bids.getRandomBid(), 'sales');
        });
        document.getElementsByClassName('add-purchase')[0].addEventListener('click', function () {
            bids.add(Bids.getRandomBid(), 'purchases');
        });

        /* Test Fill */
        _.each(bids.categoriesOrder, function (currentCategory) {
            _.times(3, function () {
                bids.add(Bids.getRandomBid(), currentCategory);
            });
        });
    });
})();