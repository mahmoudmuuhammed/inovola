import { injectable, inject } from 'inversify';
// What if you need in the future to change the container package
// we need to make standard injectable word so we can change here only
// and make our code consist.
export const Injectable = injectable;

export const Inject = inject;
