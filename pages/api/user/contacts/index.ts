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
  .get(getContacts)
  .post(postContact);

function getContacts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const contacts = UserDatabase.getAllContacts();
    return res.status(200).json(contacts);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}

function postContact(req: NextApiRequest, res: NextApiResponse) {
  try {
    const contact = UserDatabase.insertContact(JSON.parse(req.body));

    if (!contact) {
      return res.status(404).json({ error: responses.item_exists });
    }

    return res.status(200).json(contact);
  } catch (err: any) {
    return res.status(500).json({ error: responses.internal_error });
  }
}
