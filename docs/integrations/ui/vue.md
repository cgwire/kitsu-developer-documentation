## Kitsu UI

This storybook displays and documents all components available in the
`kitsu-ui` package. It contains basic UI components like a text field, a
button and Kitsu specific components like a task status dropdown. They are
all Vue3 components.

These components are aimed to be used in the CGWire ecosystem, which means:

* The Kitsu application
* Related applications such as the Kitsu Publisher
* All apps developed by the CGWire company
* Plugins developed for Kitsu

This UI library is not aimed at being used in any kind of applications, be
aware of it if you want to use it for another purpose than the one describe
above.

## Setup

First install the kitsu ui as a dependency:

```bash
npm install kitsu-ui
```

Add the Kitsu UI css to your application stylesheet:

```css
@import './node_modules/kitsu-ui/global.scss'
```

Then import components directly from the module:

```js
import { ButtonSimple } from 'kitsu-ui'
```

## Contributing

All contributions are welcome as long as they respect the following rules:

* Respect all the [C4 contract](https://rfc.zeromq.org/spec/42/) instructions.
* All contributions must respect the Kitsu styleguide.
* All contributions must be validated by the CGWire designer.
