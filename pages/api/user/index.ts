import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import responses from '../../../config/strings';
import Database from '../../../database';

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.log(err.message); // eslint-disable-line no-console
    res.status(500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Not found');
  }
})
  .post(postUser)
  .get(getUser);

async function postUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = Database.setUser(req.body);
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}

function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = Database.getUser();
    return res.status(200).json(user);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}
