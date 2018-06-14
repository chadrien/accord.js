[accord.js](../README.md) > ["index"](../modules/_index_.md)



# External module: "index"

## Index

### Type aliases

* [Command](_index_.md#command)
* [CommandData](_index_.md#commanddata)
* [Responder](_index_.md#responder)
* [Response](_index_.md#response)


### Functions

* [bootstrapBot](_index_.md#bootstrapbot)
* [createCommand](_index_.md#createcommand)



---
## Type aliases
<a id="command"></a>

###  Command

** Command**:  *function* 

*Defined in [index.ts:39](https://github.com/chadrien/accord.js/blob/8b136d9/accord.js/index.ts#L39)*


#### Type declaration
(data$: *`Observable`<[CommandData](_index_.md#commanddata)>*): `Observable`<[Response](_index_.md#response)>


*Defined in [index.ts:39](https://github.com/chadrien/accord.js/blob/8b136d9/accord.js/index.ts#L39)*



**Parameters:**

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| data$ | `Observable`<[CommandData](_index_.md#commanddata)> | - |





**Returns:** `Observable`<[Response](_index_.md#response)>






___

<a id="commanddata"></a>

###  CommandData

** CommandData**:  *object* 

*Defined in [index.ts:38](https://github.com/chadrien/accord.js/blob/8b136d9/accord.js/index.ts#L38)*


#### Type declaration


commandPrefix: `string`



message: `Message`






___

<a id="responder"></a>

###  Responder

** Responder**:  *function* 

*Defined in [index.ts:31](https://github.com/chadrien/accord.js/blob/8b136d9/accord.js/index.ts#L31)*



The Responder is a simple function that takes in the original Message and the eventual captured parentheses from the command RegExp, from which you can create a Response.

You can also return a Promise in case your Response would need to be base on an HTTP request result for example.

#### Type declaration
(message: *`Message`*, ...args: *`string`[]*): `void`⎮`Promise`<[Response](_index_.md#response)>⎮[Response](_index_.md#response)


*Defined in [index.ts:31](https://github.com/chadrien/accord.js/blob/8b136d9/accord.js/index.ts#L31)*



**Parameters:**

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| message | `Message` | - |
| args | `string`[] | - |





**Returns:** `void`⎮`Promise`<[Response](_index_.md#response)>⎮[Response](_index_.md#response)






___

<a id="response"></a>

###  Response

** Response**:  *object* 

*Defined in [index.ts:32](https://github.com/chadrien/accord.js/blob/8b136d9/accord.js/index.ts#L32)*


#### Type declaration


Optionalcontent?: `StringResolvable`



Optionaloptions?: `MessageOptions`



recipient: `TextChannel`⎮`DMChannel`⎮`GroupDMChannel`






___


## Functions
<a id="bootstrapbot"></a>

###  bootstrapBot

► **bootstrapBot**(discordBot: *`Client`*, commands: *[Command](_index_.md#command)[]*, commandPrefix?: *`string`*): `Subscription`




*Defined in [index.ts:12](https://github.com/chadrien/accord.js/blob/8b136d9/accord.js/index.ts#L12)*



`bootstrapBot` is used to start your bot, though it does not log the bot in or anything extra, this kind of things are to be done in userland© and should not be the responsibility of Accord.

The `commandPrefix` is what allows you to have for example commands like this: !ping, where '!' is the command prefix.


**Parameters:**

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| discordBot | `Client` | - |
| commands | [Command](_index_.md#command)[] | - |
| commandPrefix | `string` | Default value = &quot;&quot;.- |





**Returns:** `Subscription`





___

<a id="createcommand"></a>

###  createCommand

► **createCommand**(command: *`string`⎮`RegExp`*, responder: *[Responder](_index_.md#responder)*): [Command](_index_.md#command)




*Defined in [index.ts:48](https://github.com/chadrien/accord.js/blob/8b136d9/accord.js/index.ts#L48)*



Super simple function to create a command either from a string, in which case it will internally be transformed to a RegExp like this: 'ping' => /^ping$/; or a RegExp.

Using a RegExp allows to have more control on what you want to match, and also allows you to use capturing parentheses to then use parts of the command in the responder.


**Parameters:**

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| command | `string`⎮`RegExp` | - |
| responder | [Responder](_index_.md#responder) | - |





**Returns:** [Command](_index_.md#command)





___


