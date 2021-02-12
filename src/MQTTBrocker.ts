import mqtt from 'mqtt'

export class MQTTBroker {
  private _mqttClient!: mqtt.MqttClient

  private readonly subscribers: Map<
    string,
    ((...args: any[]) => any | Promise<any>)[]
  > = new Map()

  public async connect(): Promise<void> {
    this._mqttClient = mqtt.connect('mqtt://broker.emqx.io')

    return new Promise(resolve => {
      this._mqttClient.on('connect', () => {
        this._mqttClient.on(
          'message',
          async (topic: string, message: Buffer) => {
            console.log(`Topic = ${topic}`)
            console.log(`Message = ${message}`)

            const handlers = this.subscribers.get(topic)

            if (handlers) {
              await Promise.all(
                handlers.map(handler => handler(message.toString()))
              )
            }
          }
        )

        resolve()
      })
    })
  }

  public async subscribe(
    topic: string,
    handler: (...args: any[]) => any
  ): Promise<void> {
    const handlers = this.subscribers.get(topic)

    if (handlers) {
      handlers.push(handler)
    } else {
      this._mqttClient.subscribe(topic, subscribeError => {
        if (!subscribeError) {
          this.subscribers.set(topic, [handler])
        }
      })
    }
  }

  public publish(topic: string, message: any): void {
    this._mqttClient.publish(topic, JSON.stringify(message))
  }
}
