import * as React from 'react';

import * as styles from '../data/styles';
import Link from '@docusaurus/Link';
import { GoBook } from 'react-icons/go';
import { createAvatar } from '@dicebear/avatars';

export default function StyleOverview() {
  return (
    <div className="row mt-5">
      {Object.keys(styles).map((style) => (
        <div className="col-12 col-md-6 col-xl-4 mb-4" key={style}>
          <div className="bg-white p-4 rounded h-100 d-flex flex-column justify-content-between shadow position-relative">
            <div>
              <div className="row pb-2">
                <div className="offset-3 col-6">
                  <img src={createAvatar(styles[style], { dataUri: true })} alt={style} />
                </div>
              </div>
              <h3 className="display-3 text-center mb-0">{style}</h3>
              <p className="text-muted text-center mb-5">@dicebear/avatars-{style}</p>
            </div>
            <div className="text-center">
              <Link to={`/styles/${style}`} className="btn btn-dark d-inline-flex align-items-center stretched-link">
                <GoBook className="mr-1" size={20} />
                Read documentation
              </Link>
            </div>
          </div>
        </div>
      ))}
      <div className="col-12 col-md-6 col-xl-4 mb-4">
        <div className="bg-white p-4 rounded h-100 d-flex flex-column justify-content-between shadow">
          <div className="text-center">
            <h4 className="h5 mb-4">Your sprite collection here?</h4>
            <p>You are a designer or developer and would like to contribute with a self-designed sprite collection?</p>
            <p>Create an issue so that we can add your work to the list.</p>
          </div>
          <div className="text-center">
            <Link href="https://github.com/DiceBear/avatars/issues" className="btn btn-outline-dark mx-5">
              Create issue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
