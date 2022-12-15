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
})
  .get(getContact)
  .put(putContact)
  .delete(deleteContact);

async function getContact(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const integration = UserDatabase.getContact(id as string);

    if (!integration) {
      return res.status(404).json({ error: responses.item_not_found });
    }

    return res.status(200).json(integration);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}

async function putContact(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const contact = UserDatabase.editContact(
      id as string,
      JSON.parse(req.body)
    );

    if (!contact) {
      return res.status(409).json({ error: responses.item_not_found });
    }

    return res.status(200).json(contact);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}

async function deleteContact(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const result = UserDatabase.deleteContact(id as string);

    if (!result) {
      return res.status(404).json({ error: responses.item_not_found });
    }

    return res.status(200).json({ message: responses.success });
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}
