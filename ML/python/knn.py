import os
from sklearn.neighbors import KNeighborsClassifier
classes={
   "car":0,
   "fish":1,
   "house":2,
   "tree":3,
   "bicycle":4,
   "guitar":5,
   "pencil":6,
   "clock":7
}

def formatData(path):
    with open(path,'r') as f:
        read=f.readlines()
        x,y=[],[]
        for i in range(1,len(read)):
            row=read[i].split(',')
            x.append([float(row[j]) for j in range(len(row)-1)])
            y.append(classes[row[-1].strip()])

    return x,y


training=formatData("../data/datasets/training.csv")
testing=formatData("../data/datasets/testing.csv")

knn=KNeighborsClassifier(
    n_neighbors=5,
    algorithm="brute",weights="uniform")

knn.fit(training[0],training[1])

accuracy=knn.score(testing[0],testing[1])
print(accuracy)