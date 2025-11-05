import { createSafeActionClient } from 'next-safe-action';

// This is our action client.
// It can be used to create safe server actions.
const action = createSafeActionClient();

export default action;
