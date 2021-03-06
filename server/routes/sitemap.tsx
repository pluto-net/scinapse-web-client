import * as AWS from 'aws-sdk';

export default async function getSitemap(pathname: string): Promise<{ body: string }> {
  const s3 = new AWS.S3();

  let s3ObjKey: string;
  if (pathname === '/sitemap') {
    s3ObjKey = 'sitemap.xml.gz';
  } else {
    const reqPathToken = pathname.split('/');
    s3ObjKey = `${reqPathToken[reqPathToken.length - 1]}.gz`;
  }

  const body = await new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: 'scinapse-sitemap',
        Key: s3ObjKey,
      },
      (err: AWS.AWSError, data: any) => {
        if (err) {
          console.error('Error occurred while retrieving sitemap object from S3', err);
          reject(err);
        } else {
          resolve(data.Body as Buffer);
        }
      }
    );
  });

  const encodedBody = (body as Buffer).toString('base64');

  return {
    body: encodedBody,
  };
}
