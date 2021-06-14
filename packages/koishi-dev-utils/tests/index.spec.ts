import { NextFunction, Session } from 'koishi-core'
import { App } from 'koishi-test-utils'
import { Plugin, PluginContext, Middleware, Event } from 'koishi-dev-utils'
import { expect } from 'chai'
import jest from 'jest-mock'

describe('Plugin Context', () => {
  const fn = jest.fn()

  interface Config {
    text: string
  }

  @Plugin('test-1')
  class MyPlugin extends PluginContext<Config> {
    @Middleware()
    hello(session: Session, next: NextFunction) {
      session.send(this.config.text)
    }

    @Event('disconnect')
    onDisconnect() {
      fn()
    }
  }

  const app = new App().plugin(new MyPlugin(), { text: 'hello!' })
  const sess = app.session('123')

  it('middleware', async () => {
    await sess.shouldReply('say hello', 'hello!')
  })

  it('event', async () => {
    expect(fn.mock.calls).to.have.length(0)
    app.emit('disconnect')
    expect(fn.mock.calls).to.have.length(1)
  })
})
