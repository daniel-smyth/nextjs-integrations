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
  .get(getUserIntegration)
  .post(postUserIntegration)
  .delete(deleteUserIntegration);

async function getUserIntegration(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const integration = UserDatabase.getIntegration(id as string);

    if (!integration) {
      return res.status(404).json({ error: responses.item_not_found });
    }

    return res.status(200).json(integration);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}

async function postUserIntegration(req: NextApiRequest, res: NextApiResponse) {
  try {
    const integration = UserDatabase.insertIntegration(JSON.parse(req.body));

    if (!integration) {
      return res.status(409).json({ error: responses.item_exists });
    }

    return res.status(200).json(integration);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}

async function deleteUserIntegration(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
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
