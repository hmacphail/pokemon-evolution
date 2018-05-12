'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		let tasks = [
			queryInterface.changeColumn('learnsets', 'onEvo', { type: Sequelize.BOOLEAN, allowNull: false }),
			queryInterface.renameColumn('games', 'name', 'description'),
			queryInterface.addColumn('moves', 'target', { type: Sequelize.STRING(50), allowNull: false }),
			queryInterface.addColumn('moves', 'speedPriority', { type: Sequelize.INTEGER, allowNull: false }),
			queryInterface.addColumn('moves', 'baseCritHitChance', { type: Sequelize.FLOAT }),
			queryInterface.addColumn('moves', 'physicalContact', { type: Sequelize.BOOLEAN, allowNull: false }),
			queryInterface.addColumn('moves', 'secondaryEffect', { type: Sequelize.STRING(255) }),
			queryInterface.addColumn('moves', 'secondaryEffectRate', { type: Sequelize.FLOAT }),
			queryInterface.addColumn('moves', 'tmNumber', { type: Sequelize.STRING(20) }),
			queryInterface.addColumn('moves', 'hmNumber', { type: Sequelize.STRING(20) })
		];

		return queryInterface.sequelize.Promise.all(tasks);
	},

	down: (queryInterface, Sequelize) => {
		let tasks = [
			queryInterface.removeColumn('moves', 'isTM'),
			queryInterface.removeColumn('moves', 'extraInfo'),
			queryInterface.removeColumn('moves', 'extraInfoColumn')
		];

		return queryInterface.sequelize.Promise.all(tasks);
	}
};
