###############################################################################
#
# Copyright (C) 2016 Bitquant Research Laboratories (Asia) Limited
#
# Licensed under the Simplified BSD License
#
###############################################################################

import spstore
import logging
from backtrader.metabase import MetaParams
from backtrader.utils.py3 import with_metaclass
from backtrader.brokers.bbroker import BackBroker
from backtrader.comminfo import CommInfoBase

class ReportBase(object):
    def __init__(self, strategy):
        super(ReportBase, self).__init__()
        self.strategy = strategy

    def log(self, *args, dt=None, level=logging.INFO):
        ''' Logging function fot this strategy'''
        if level < self.strategy.p.loglevel:
            return
        dt = dt or self.strategy.datas[0].datetime.datetime()
        print('%s, ' % dt.isoformat(' '), *args,
              file=self.strategy.p.log)

    def buy(self, kwargs):
        self.log("buy", kwargs, level=logging.DEBUG)

    def sell(self, kwargs):
        self.log("sell", kwargs, level=logging.DEBUG)

    def notify_order(self, order):
        if order.status in [order.Submitted, order.Accepted]:
            # Buy/Sell order submitted/accepted to/by broker - Nothing to do
            return

        if order.status in [order.Rejected]:
            self.log("REJECTED")
            return

        # Check if an order has been completed
        # Attention: broker could reject order if not enougth cash
        if order.status in [order.Completed, order.Canceled, order.Margin]:
            if order.isbuy():
                self.log(
                    'BUY EXECUTED, Price: %.2f, Cost: %.2f, Comm %.2f' %
                    (order.executed.price,
                     order.executed.value,
                     order.executed.comm))
            else:  # Sell
                self.log('SELL EXECUTED, Price: %.2f, Cost: %.2f, Comm %.2f' %
                         (order.executed.price,
                          order.executed.value,
                          order.executed.comm))
    def notify_trade(self, trade):
        if not trade.isclosed:
            return
        self.log('OPERATION PROFIT, GROSS %.2f, NET %.2f' %
                 (trade.pnl, trade.pnlcomm))


class DebugReport(ReportBase):
    def __init__(self, strategy):
        super(DebugReport, self).__init__(strategy)


class TradeReport(ReportBase):
    def __init__(self):
        super(TradeReport, self).__init__(strategy)

report_list = {
    "debug" : DebugReport,
    "trade" : TradeReport
    }
