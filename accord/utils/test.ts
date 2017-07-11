import { deepEqual } from 'assert';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/takeUntil';

export const assertEqual = deepEqual;
