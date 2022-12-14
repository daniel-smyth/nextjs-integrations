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
}).post(postUserIntegration);

async function postUserIntegration(req: NextApiRequest, res: NextApiResponse) {
  try {
    const integration = UserDatabase.insertIntegration(JSON.parse(req.body));

    if (!integration) {
      return res.status(409).json({ error: responses.item_exists });
    }

    console.log(UserDatabase);
    return res.status(200).json(integration);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}
