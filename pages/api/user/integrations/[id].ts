import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import responses from '../../../../config/strings';
import UserDatabase from '../../../../database/User';

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    res.status(500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Not found');
  }
}).delete(deleteUserIntegration);

async function deleteUserIntegration(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(UserDatabase);

    const { id } = req.query;
    const result = UserDatabase.deleteIntegration(id as string);

    if (!result) {
      return res.status(404).json({ error: responses.item_not_found });
    }

    return res.status(200).json({ message: responses.success });
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}
