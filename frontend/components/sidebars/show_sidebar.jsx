var React = require('react'),
    History = require('react-router').History;

var AccountTypeIndex = require('../account_type_index'),
    ComponentActions = require('../../actions/component_actions');

var AccountShowSidebar = React.createClass({
  mixins: [History],

  getInitialState: function () {
    return {
      typeClicked: false,
      accountId: this.props.accountId || null,
      allAccounts: this.props.showAllAccounts || null
    };
  },

  handleAccountTypeClick: function (type) {
    this.setState({typeClicked: type, accountId: null, allAccounts: null});
    this.props.accountTypeClick(type);
  },

  handleAllAccountsClick: function () {
    if (this.props.allAccountsClick) {
      this.props.allAccountsClick();
    } else {
      this.history.pushState(null, '/', {});
    }
  },

  handleAccountClick: function (account) {
    this.setState({typeClicked: false, accountId: null, allAccounts: null});
    this.history.pushState(null, 'accounts/' + account.id, {});
  },


  render: function () {
    var that = this,
        accounts = this.props.accounts,
        accountTypes = ComponentActions.getAccountTypes(accounts),
        accountsArr = ComponentActions.getAccountsArr(accounts),
        allAccountsClass = "account-types-show-type",
        mappedAccountTypes = this.getMappedAccountTypes(accountTypes),
        transactionMappedAccounts = this.getTransactionMappedAccounts(accountsArr);

    if (this.state.allAccounts) {
      allAccountsClass = "account-types-show-type selected-account";
    }

    return (
      <section className="root-content-sidebar-show">
        <h1>Type</h1>
        {mappedAccountTypes}
        <h1>Accounts</h1>

        <h3 onClick={this.handleAllAccountsClick} className={allAccountsClass}>All Accounts</h3>

        {transactionMappedAccounts}
      </section>
    );
  },

  getMappedAccountTypes: function (accountTypes) {
    var that = this;
    var mappedAccountTypes = accountTypes.map(function(type){
      var accountClass = "account-types-show-type";
      if (type === that.state.typeClicked) {
        accountClass = "account-types-show-type selected-account";
      }
      return (
        <h3
          onClick={that.handleAccountTypeClick.bind(null, type)}
          key={type}
          className={accountClass}>{type}</h3>
      );
    });

    return mappedAccountTypes;
  },

  getTransactionMappedAccounts: function (accountsArr) {
    var that = this;
    var transactionMappedAccounts = accountsArr.map(function(account, index){
      var accountClass = "account-types-show-type";
      var accountId = parseInt(that.state.accountId);

      if (account.id === accountId || account.account_type === that.state.typeClicked) {
        accountClass = "account-types-show-type selected-account";
      }
      return (
        <a key={index} href={"#/accounts/" + account.id}>
          <h3
            onClick={that.handleAccountClick.bind(null, account)}
            className={accountClass}>{account.name}</h3>
        </a>
      );
    });

    return transactionMappedAccounts;
  }


 });

module.exports = AccountShowSidebar;
