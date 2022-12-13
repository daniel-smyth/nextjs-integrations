import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import responses from '../../../config/strings';
import UserDatabase from '../../../database/User';

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    res.status(500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Not found');
  }
})
  .get(getUser)
  .put(putUser);

function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = UserDatabase.get();

    if (!user) {
      return res.status(404).json({ error: responses.item_not_found });
    }

    return res.status(200).json(user);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}

function putUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = UserDatabase.set(JSON.parse(req.body));
    return res.status(200).json(user);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}
