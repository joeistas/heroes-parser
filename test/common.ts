import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'

import { buildLogger } from '../src/logger'

chai.use(sinonChai)

buildLogger({ logLevel: 'none', console: console } as any)
