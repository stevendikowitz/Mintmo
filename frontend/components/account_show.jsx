var React = require('react'),
    History = require('react-router').History;

var AccountStore =require('../stores/account'),
    ApiUtil = require('../util/api_util'),
    TransactionIndex = require('./transaction_index'),
    Header = require('./header'),
    AccountShowSidebar = require('./sidebars/show_sidebar'),
    TransactionIndexItem = require('./transaction_index_item'),
    ComponentActions = require('../actions/component_actions'),
    TransactionIndexForm = require('./transaction_form');

var AccountShow = React.createClass({
  mixins: [History],

  getInitialState: function () {
    return {
      account: AccountStore.find(this.props.params.accountId),
      allAccounts: AccountStore.all(),
      overviewClicked: false,
      transactionsClicked: true,
      formIndex: null
    };
  },

  componentDidMount: function () {
    ApiUtil.fetchAccount(parseInt(this.props.params.accountId));
    this.accountListener = AccountStore.addListener(this.onChange);
  },

  componentWillReceiveProps: function (newProps) {
    ApiUtil.fetchAccount(newProps.params.accountId);
  },

  onChange: function () {
    this.setState({account: AccountStore.find(this.props.params.accountId), allAccounts: AccountStore.all()});
  },

  componentWillUnmount: function () {
    this.accountListener.remove();
  },

  handleAccountTypeClick: function () {

  },

  handleOverviewClick: function () {
    this.history.pushState(null, 'accounts', {});
  },

  handleTransactionsClick: function (e) {
    e.preventDefault();
    this.history.pushState(null, 'transactions', {});
  },

  handleAccountClick: function () {
    this.setState({accountClicked: true});
  },

  handleAllAccountsClick: function (e) {
    e.preventDefault();
    this.history.pushState(null, 'accounts', {});
  },

  makeFormIndex: function (index) {
    this.setState({formIndex: index});
  },

  render: function () {

    var that = this,
        account = this.state.account,
        accounts = this.state.allAccounts,
        transactionsClicked =this.state.transactionsClicked,
        overviewClicked =this.state.overviewClicked,
        overviewClass = ComponentActions.getOverviewClass(overviewClicked),
        transactionClass = ComponentActions.getTransactionClass(transactionsClicked),
        header =
          <Header
            overviewClicked={overviewClicked}
            overviewClick={this.handleOverviewClick}
            transactionsClicked={transactionsClicked}
            transactionsClick={this.handleTransactionsClick}/>,
          sidebar =
          <AccountShowSidebar
            accounts={that.state.allAccounts}
            accountClick={that.handleAccountClick}
            transactionsClick={that.handleTransactionsClick}
            />;

    if (!(account && account.transactions)) { return <div>SPINNER</div>; }

    var mappedBody = account.transactions.map(function(transaction, index) {
      if (index === that.state.formIndex) {
        return (
          <TransactionItemForm
              transaction={transaction}
              key={index} /> );
      } else {
        return (
          <TransactionIndexItem
            onClick={that.makeFormIndex.bind(null, index)}
            transaction={transaction}
            key={index} /> );
      }
    });

    return (
      <div>
        {header}
      <main className="root-content group">

        {sidebar}

        <section className="root-content-main">
          <h1>{account.name.slice(0,25)}...</h1>
          <h6>TOTAL BALANCE</h6>
          <h5>{account.balance}</h5>
          <table className="transaction-table group">
            <thead className="transaction-table-header">
              <tr >
                <th className="date">Date</th>
                <th className="description">Description</th>
                <th className="category">Category</th>
                <th className="amount">Amount</th>
              </tr>
            </thead>
            <tbody className="transaction-table-body">
              {mappedBody}
            </tbody>
          </table>
        </section>
      </main>
    </div>);
  }

});


module.exports = AccountShow;